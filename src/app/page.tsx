"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ParticleBackground } from "@/components/animations/particle-background";
import { Floating } from "@/components/animations/floating";
import { CountUp } from "@/components/animations/count-up";
import { Button } from "@/components/ui/button";
import { CAREER_LEVELS } from "@/constants/career-levels";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Briefcase, Trophy, Flame, Timer, TrendingUp,
  Code, Rocket, Star, Zap, Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Thăng Cấp Sự Nghiệp",
    desc: "Bắt đầu từ Intern, hoàn thành nhiệm vụ để thăng cấp lên Junior, Middle, Senior và xa hơn nữa.",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    icon: Timer,
    title: "Deadline & KPI",
    desc: "Mỗi nhiệm vụ có deadline thực tế. Không hoàn thành đúng hạn? Cẩn thận bị giáng chức!",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: Trophy,
    title: "Bảng Xếp Hạng",
    desc: "Cạnh tranh với cộng đồng qua Weekly Ranking, Monthly Seasons và Global Leaderboard.",
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    icon: Flame,
    title: "Streak & Daily Quest",
    desc: "Duy trì streak hàng ngày, hoàn thành nhiệm vụ để nhận thưởng và giữ vị trí.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: Code,
    title: "8 Loại Nhiệm Vụ",
    desc: "Coding, Bug Fix, Refactor, Code Review, System Design, Database, Deployment, Debug.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: Shield,
    title: "Promotion Challenge",
    desc: "Vượt qua bài thi đặc biệt để chứng minh năng lực và lên chức mới.",
    gradient: "from-emerald-500 to-green-500",
  },
];

const STATS = [
  { value: 100, label: "Nhiệm Vụ", suffix: "+", icon: "📋" },
  { value: 7, label: "Cấp Bậc", suffix: "", icon: "🏆" },
  { value: 30, label: "Thành Tựu", suffix: "+", icon: "⭐" },
  { value: 10, label: "Thú Cưng", suffix: "+", icon: "🐾" },
];

const TESTIMONIALS = [
  {
    name: "Minh Trí",
    role: "Senior Developer",
    text: "Career Quest giúp mình maintain thói quen code hàng ngày. Cơ chế giáng chức làm mình không dám lười!",
    avatar: "MT",
  },
  {
    name: "Thu Hà",
    role: "Tech Lead",
    text: "Hệ thống bài tập rất sát với công việc thực tế. Từ bug fix đến system design, đủ hết!",
    avatar: "TH",
  },
  {
    name: "Hoàng Nam",
    role: "Junior Developer",
    text: "Mình bắt đầu từ Intern, giờ đã lên Junior. Cảm giác thăng cấp thật sự rất phấn khích!",
    avatar: "HN",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground count={60} palette="career" />

      {/* Floating nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="mx-auto max-w-6xl flex items-center justify-between glass-strong rounded-2xl px-6 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <span className="font-bold text-sm text-gradient-career">Career Quest RPG</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button variant="career" size="sm">Bắt đầu ngay</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-screen flex-col items-center justify-center px-4 text-center pt-20"
      >
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute right-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[100px]" />

        <Floating duration={4} distance={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="mb-6 text-7xl sm:text-8xl"
          >
            🚀
          </motion.div>
        </Floating>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-4 max-w-4xl"
        >
          <span className="block text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gradient-career leading-tight">
            CAREER QUEST RPG
          </span>
          <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-gradient-fire leading-tight">
            Từ Intern đến CTO
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-10 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
        >
          Học lập trình qua game mô phỏng sự nghiệp.{" "}
          <br className="hidden sm:block" />
          Hoàn thành nhiệm vụ, đạt KPI, và thăng cấp{" "}
          <span className="text-gradient-gold font-semibold">từ Intern lên CTO</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register">
            <Button variant="career" size="xl" className="min-w-[220px]">
              <Zap className="h-5 w-5" /> Bắt Đầu Miễn Phí
            </Button>
          </Link>
          <Link href="#career-path">
            <Button variant="neon" size="xl" className="min-w-[220px]">
              <Briefcase className="h-5 w-5" /> Xem Lộ Trình
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-muted-foreground/50"
          >
            <span className="text-xs uppercase tracking-widest">Cuộn xuống</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ===== STATS BAR ===== */}
      <section className="relative px-4 py-14 border-y border-border/30">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1 text-center"
              >
                <span className="text-3xl">{stat.icon}</span>
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  className="text-3xl sm:text-4xl font-bold text-gradient-purple"
                />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CAREER PATH ===== */}
      <section id="career-path" className="relative px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-gradient-career">
              Lộ Trình Sự Nghiệp
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              7 cấp bậc, từ thực tập sinh mới vào nghề đến Giám đốc Công nghệ
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-purple-500 to-amber-500 hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {CAREER_LEVELS.map((level, i) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className={`relative lg:flex lg:items-center lg:gap-8 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } lg:py-6`}
                >
                  {/* Node */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10 h-12 w-12 items-center justify-center rounded-full border-4 border-background text-2xl shadow-lg"
                    style={{ backgroundColor: level.badgeColor + "20", borderColor: level.badgeColor }}
                  >
                    {level.badgeIcon}
                  </div>

                  {/* Card */}
                  <div className={`lg:w-[calc(50%-3rem)] ${i % 2 === 0 ? "lg:text-right lg:pr-8" : "lg:pl-8"}`}>
                    <div className="glass rounded-xl p-5 hover:shadow-lg transition-all duration-300 group">
                      <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? "lg:justify-end" : ""}`}>
                        <span className="text-2xl lg:hidden">{level.badgeIcon}</span>
                        <div>
                          <h3 className="font-bold text-base">{level.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            Lương: {new Intl.NumberFormat("vi-VN").format(level.salary)}đ/tháng
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{level.description}</p>
                      <div className={`flex flex-wrap gap-1.5 ${i % 2 === 0 ? "lg:justify-end" : ""}`}>
                        {level.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: level.badgeColor + "15",
                              color: level.badgeColor,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Spacer for other side */}
                  <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative px-4 py-24 border-t border-border/30">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-gradient-purple">
              Tại Sao Chọn Career Quest?
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Không chỉ học code — bạn đang xây dựng sự nghiệp
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br ${f.gradient} text-white shadow-md`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-base font-bold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative px-4 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 text-2xl sm:text-3xl font-bold text-gradient-gold">
              Người Chơi Nói Gì?
            </h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-10 sm:p-14 text-center shadow-xl">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-5xl mb-6"
            >
              💼
            </motion.div>
            <h2 className="mb-4 text-xl sm:text-2xl font-bold text-gradient-career">
              Sẵn Sàng Thăng Cấp?
            </h2>
            <p className="mb-8 text-muted-foreground max-w-sm mx-auto">
              Tham gia ngay và bắt đầu hành trình từ Intern đến CTO.
              Hoàn toàn miễn phí!
            </p>
            <Link href="/register">
              <Button variant="career" size="xl" className="min-w-[220px]">
                <Rocket className="h-5 w-5" /> Đăng Ký Ngay
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border/30 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <span className="text-sm font-bold text-gradient-career">
              Career Quest RPG
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Career Quest RPG. Từ Intern đến CTO.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Giới thiệu
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Chính sách
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Điều khoản
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
