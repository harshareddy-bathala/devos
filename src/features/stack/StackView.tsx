import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { nanoid } from 'nanoid';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { Plus, Sparkles, BarChart3, Target, TrendingUp } from 'lucide-react';
import GlassCard from '@components/ui/GlassCard';
import ProgressBar from '@components/ui/ProgressBar';
import { useProjectsStore } from '@/stores/projects.store';
import { toast } from '@/stores/toast.store';
import { getDatabase } from '@/lib/db';
import type { ConfidenceLevel, Project, ProjectStatus } from '@/types';
import styles from './PageView.module.css';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const pageTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

type SortKey = 'xp' | 'name' | 'confidence';

interface ManualSkillRow {
  id: string;
  name: string;
  xp: number;
  created_at: string;
}

interface ConfidenceMeta {
  level: ConfidenceLevel;
  label: string;
  min: number;
  max: number;
  next: number | null;
  className: string;
  index: number;
}

interface SkillStat {
  name: string;
  xp: number;
  projects: number;
  courses: number;
  confidence: ConfidenceMeta;
  progressToNext: number;
  nextLabel: string;
}

const CONFIDENCE_RULES: ConfidenceMeta[] = [
  { level: 'beginner', label: 'Beginner', min: 0, max: 149, next: 150, className: 'beginner', index: 0 },
  { level: 'learning', label: 'Learning', min: 150, max: 399, next: 400, className: 'learning', index: 1 },
  { level: 'comfortable', label: 'Comfortable', min: 400, max: 799, next: 800, className: 'comfortable', index: 2 },
  { level: 'fluent', label: 'Fluent', min: 800, max: 1499, next: 1500, className: 'fluent', index: 3 },
  { level: 'expert', label: 'Expert', min: 1500, max: Infinity, next: null, className: 'expert', index: 4 },
];

const STATUS_BONUS: Record<ProjectStatus, number> = {
  planned: 20,
  active: 80,
  building: 110,
  shipped: 160,
  paused: 35,
};

const MIN_SKILL_XP = 15;
const PROGRESS_MULTIPLIER = 8;

function normalizeKey(name: string): string {
  return name.trim().toLowerCase();
}

function pickDisplayName(existing: string | undefined, incoming: string): string {
  if (!existing) return incoming.trim();
  return existing.length >= incoming.length ? existing : incoming.trim();
}

function getConfidenceMeta(xp: number): ConfidenceMeta {
  let rule = CONFIDENCE_RULES[0];

  for (const candidate of CONFIDENCE_RULES) {
    rule = candidate;
    if (xp <= candidate.max) break;
  }

  return rule;
}

function buildSkillStats(projects: Project[], manualSkills: ManualSkillRow[]): SkillStat[] {
  const base = new Map<string, { name: string; xp: number; projects: number; courses: number }>();

  manualSkills.forEach((skill) => {
    const key = normalizeKey(skill.name);
    base.set(key, {
      name: skill.name.trim(),
      xp: Number(skill.xp) || 0,
      projects: 0,
      courses: 0,
    });
  });

  projects.forEach((project) => {
    const tags = Array.from(new Set((project.stack_tags || []).map((tag) => tag.trim()).filter(Boolean)));
    if (!tags.length) return;

    const progressScore = Math.round(project.progress * PROGRESS_MULTIPLIER);
    const statusBonus = STATUS_BONUS[project.status] ?? 0;
    const perTagXP = Math.max(MIN_SKILL_XP, Math.round((progressScore + statusBonus) / tags.length));

    tags.forEach((tag) => {
      const key = normalizeKey(tag);
      const existing = base.get(key);

      base.set(key, {
        name: pickDisplayName(existing?.name, tag),
        xp: (existing?.xp ?? 0) + perTagXP,
        projects: (existing?.projects ?? 0) + 1,
        courses: existing?.courses ?? 0,
      });
    });
  });

  const skills: SkillStat[] = [];

  base.forEach((value) => {
    const confidence = getConfidenceMeta(value.xp);
    const span = confidence.next ? confidence.next - confidence.min : 1;
    const progressToNext = confidence.next ? Math.min(1, (value.xp - confidence.min) / span) : 1;
    const nextLevelLabel = CONFIDENCE_RULES[confidence.index + 1]?.label ?? 'Expert';
    const remaining = confidence.next ? Math.max(0, confidence.next - value.xp) : 0;

    skills.push({
      ...value,
      confidence,
      progressToNext,
      nextLabel: confidence.next ? `${remaining} XP to ${nextLevelLabel}` : 'Maxed',
    });
  });

  return skills;
}

export default function StackView() {
  const projects = useProjectsStore((state) => state.projects);
  const projectsLoading = useProjectsStore((state) => state.isLoading);
  const [manualSkills, setManualSkills] = useState<ManualSkillRow[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('xp');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSkills() {
      setIsLoading(true);
      try {
        const db = await getDatabase();
        const rows = await db.select<ManualSkillRow>(
          'SELECT id, name, xp, created_at FROM skills ORDER BY datetime(created_at) DESC'
        );
        if (mounted) {
          setManualSkills(rows);
        }
      } catch (error) {
        console.error('Failed to load skills', error);
        toast.error('Could not load stack data', 'Check database availability and try again.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadSkills();
    return () => {
      mounted = false;
    };
  }, []);

  const skills = useMemo(() => buildSkillStats(projects, manualSkills), [projects, manualSkills]);

  const sortedSkills = useMemo(() => {
    const next = [...skills];

    next.sort((a, b) => {
      if (sortKey === 'xp') {
        return sortDir === 'asc' ? a.xp - b.xp : b.xp - a.xp;
      }
      if (sortKey === 'name') {
        return sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc'
        ? a.confidence.index - b.confidence.index
        : b.confidence.index - a.confidence.index;
    });

    return next;
  }, [skills, sortDir, sortKey]);

  const radarSkills = useMemo(() => sortedSkills.slice(0, 6), [sortedSkills]);
  const maxRadarXP = useMemo(
    () => Math.max(...radarSkills.map((s) => s.xp), 1),
    [radarSkills]
  );

  const totalXP = skills.reduce((acc, skill) => acc + skill.xp, 0);
  const topSkill = radarSkills[0] ?? sortedSkills[0];

  const handleAddSkill = async () => {
    const name = skillInput.trim();
    if (!name) return;

    const duplicate = skills.some((skill) => normalizeKey(skill.name) === normalizeKey(name));
    if (duplicate) {
      toast.info('Already tracked', `${name} is already in your stack.`);
      return;
    }

    setIsAdding(true);
    try {
      const db = await getDatabase();
      const now = new Date().toISOString();
      await db.execute(
        'INSERT OR IGNORE INTO skills (id, name, xp, created_at) VALUES (?, ?, ?, ?)',
        [nanoid(12), name, 0, now]
      );
      const rows = await db.select<ManualSkillRow>(
        'SELECT id, name, xp, created_at FROM skills ORDER BY datetime(created_at) DESC'
      );
      setManualSkills(rows);
      setSkillInput('');
      toast.success('Skill added', `${name} will now appear in your radar.`);
    } catch (error) {
      console.error('Failed to add skill', error);
      toast.error('Could not add skill', 'Check database availability and try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const renderRadar = () => {
    if (radarSkills.length < 3) {
      return (
        <div className={styles.radarEmpty}>
          <Sparkles size={16} />
          <p>Add at least 3 skills to see the radar chart.</p>
        </div>
      );
    }

    const data = radarSkills.map((skill) => ({
      name: skill.name,
      value: Math.max(12, (skill.xp / maxRadarXP) * 100),
      xp: skill.xp,
    }));

    return (
      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={data} startAngle={90} endAngle={-270}>
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-purple)" stopOpacity={0.65} />
              <stop offset="100%" stopColor="var(--color-blue)" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <PolarGrid radialLines={false} stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
          />
          <Radar
            dataKey="value"
            stroke="var(--color-purple)"
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={0.5}
            dot={{ fill: 'var(--color-purple-text)', r: 3 }}
            isAnimationActive
            animationDuration={600}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      className={styles.page}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div>
            <p className={styles.eyebrow}>Radar · Skills</p>
            <h1 className={styles.title}>Stack Radar</h1>
            <p className={styles.subtitle}>
              Auto-tracked skills from your projects. Confidence updates as XP grows.
            </p>
          </div>
          <div className={styles.stats}>
            <div className={styles.statPill}>
              <BarChart3 size={14} />
              <div>
                <p className={styles.statLabel}>Tracked Skills</p>
                <p className={styles.statValue}>{skills.length}</p>
              </div>
            </div>
            <div className={styles.statPill}>
              <Target size={14} />
              <div>
                <p className={styles.statLabel}>Total XP</p>
                <p className={styles.statValue}>{totalXP.toLocaleString()} XP</p>
              </div>
            </div>
            <div className={styles.statPill}>
              <TrendingUp size={14} />
              <div>
                <p className={styles.statLabel}>Projects</p>
                <p className={styles.statValue}>{projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.input}
              placeholder="Add a skill (e.g. Rust, Next.js)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleAddSkill();
                }
              }}
            />
            <button
              className={styles.addButton}
              onClick={() => void handleAddSkill()}
              disabled={!skillInput.trim() || isAdding}
            >
              <Plus size={14} />
              Add skill
            </button>
          </div>

          <div className={styles.sortControls}>
            <button
              className={`${styles.sortButton} ${sortKey === 'xp' ? styles.sortActive : ''}`}
              onClick={() => handleSortChange('xp')}
            >
              XP
            </button>
            <button
              className={`${styles.sortButton} ${sortKey === 'confidence' ? styles.sortActive : ''}`}
              onClick={() => handleSortChange('confidence')}
            >
              Confidence
            </button>
            <button
              className={`${styles.sortButton} ${sortKey === 'name' ? styles.sortActive : ''}`}
              onClick={() => handleSortChange('name')}
            >
              A–Z
            </button>
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <GlassCard className={styles.radarCard} variant="elevated" padding="lg">
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.cardLabel}>Top 6 skills</p>
              <h3 className={styles.cardTitle}>Skill Radar</h3>
              <p className={styles.cardNote}>
                Scaled to your strongest tech. Click a skill to focus in the list.
              </p>
            </div>
            {topSkill && (
              <div className={styles.highlight}>
                <span className={`${styles.levelBadge} ${styles[topSkill.confidence.className]}`}>
                  {topSkill.confidence.label}
                </span>
                <p className={styles.highlightName}>{topSkill.name}</p>
                <p className={styles.highlightXP}>{topSkill.xp.toLocaleString()} XP</p>
              </div>
            )}
          </div>

          <div className={styles.radarWrap}>{renderRadar()}</div>

          {radarSkills.length > 0 && (
            <div className={styles.radarLegend}>
              {radarSkills.map((skill) => (
                <div key={skill.name} className={styles.legendItem}>
                  <span className={styles.legendDot} />
                  <div>
                    <p className={styles.legendName}>{skill.name}</p>
                    <p className={styles.legendMeta}>
                      {skill.xp.toLocaleString()} XP · {skill.confidence.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className={styles.tableCard} variant="default" padding="lg">
          <div className={styles.tableHeader}>
            <span>Skill</span>
            <span>XP</span>
            <span>Confidence</span>
            <span>Projects</span>
            <span>Courses</span>
            <span>Progress</span>
          </div>

          {isLoading || projectsLoading ? (
            <div className={styles.loadingRow}>Loading stack data…</div>
          ) : sortedSkills.length === 0 ? (
            <div className={styles.emptyRow}>
              <Sparkles size={16} />
              <div>
                <p className={styles.emptyTitle}>No skills tracked yet</p>
                <p className={styles.emptyDescription}>
                  Add a skill or tag a project stack to auto-populate your radar.
                </p>
              </div>
            </div>
          ) : (
            <div className={styles.rows}>
              {sortedSkills.map((skill) => (
                <div key={skill.name} className={styles.row}>
                  <div className={styles.nameCell}>
                    <div className={styles.skillName}>{skill.name}</div>
                    <div className={styles.skillMeta}>
                      {skill.projects} projects · {skill.courses} courses
                    </div>
                  </div>
                  <div className={styles.xpCell}>{skill.xp.toLocaleString()} XP</div>
                  <div>
                    <span className={`${styles.levelBadge} ${styles[skill.confidence.className]}`}>
                      {skill.confidence.label}
                    </span>
                  </div>
                  <div className={styles.countCell}>{skill.projects}</div>
                  <div className={styles.countCell}>{skill.courses}</div>
                  <div className={styles.progressCell}>
                    <ProgressBar
                      value={Math.round(skill.progressToNext * 100)}
                      variant={
                        skill.confidence.level === 'beginner'
                          ? 'info'
                          : skill.confidence.level === 'learning'
                            ? 'info'
                            : 'success'
                      }
                      size="sm"
                    />
                    <p className={styles.progressLabel}>{skill.nextLabel}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </motion.div>
  );
}
