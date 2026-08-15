import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { MOCK_COURSES } from '../data/algerianData';
import { useLanguage } from '../context/LanguageContext';
import { GraduationCap, Clock, BookOpen, Award, CheckCircle2, Play } from 'lucide-react';

export const LearnView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-6 px-4 max-w-md mx-auto space-y-5 animate-fade-in pb-28">
      {/* Title */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-brand-cream">
          {t('learn')}
        </h1>
        <p className="text-xs text-brand-muted">
          Build technical skills & languages for the Algerian market.
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {MOCK_COURSES.map((course) => (
          <Card key={course.id} className="p-0 overflow-hidden border-brand-border/80">
            {/* Thumbnail Header */}
            <div className="relative h-36 w-full">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/40 to-transparent" />
              <div className="absolute top-3 left-3 ltr:left-3 rtl:right-3">
                <Badge variant="bronze">{course.category}</Badge>
              </div>
              {course.certificateProvided && (
                <div className="absolute top-3 right-3 ltr:right-3 rtl:left-3 bg-brand-dark/80 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" /> Certificate
                </div>
              )}
            </div>

            {/* Course Body */}
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-base font-semibold text-brand-cream">{course.title}</h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Instructor: <span className="text-brand-bronze font-medium">{course.instructorName}</span> ({course.instructorRole})
                </p>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-brand-muted pt-1 border-t border-brand-border/40">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-bronze" /> {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-brand-bronze" /> {course.lessonsCount} lessons
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-cream">
                  {course.level}
                </span>
              </div>

              {/* Progress Bar if enrolled */}
              {course.progressPercent !== undefined && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-brand-muted">Course Completion</span>
                    <span className="text-brand-bronze font-bold">{course.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-brand-dark h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-bronze h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Primary CTA */}
              <div className="pt-2">
                <Button variant="primary" size="md" fullWidth>
                  <Play className="w-3.5 h-3.5 ltr:mr-1.5 rtl:ml-1.5 fill-current" />
                  Start Learning
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
