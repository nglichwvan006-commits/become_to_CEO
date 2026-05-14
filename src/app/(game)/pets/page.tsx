"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/animations/fade-in";
import { Floating } from "@/components/animations/floating";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PawPrint, Zap, CheckCircle } from "lucide-react";

const DEMO_PETS = [
  { id: "1", name: "Coding Cat", icon: "🐱", description: "Tăng 5% EXP từ nhiệm vụ Coding", rarity: "common" as const, bonusType: "exp_coding", bonusValue: 5, owned: true, active: true },
  { id: "2", name: "Debug Dragon", icon: "🐉", description: "Tăng 10% EXP từ nhiệm vụ Bug Fix", rarity: "rare" as const, bonusType: "exp_bugfix", bonusValue: 10, owned: true, active: false },
  { id: "3", name: "Binary Fox", icon: "🦊", description: "Giảm 5% nguy cơ giáng chức", rarity: "epic" as const, bonusType: "demotion_reduce", bonusValue: 5, owned: false, active: false },
  { id: "4", name: "CTO Owl", icon: "🦉", description: "Tăng 15% danh tiếng", rarity: "legendary" as const, bonusType: "reputation", bonusValue: 15, owned: false, active: false },
  { id: "5", name: "Stack Bunny", icon: "🐰", description: "Tăng 3% EXP từ tất cả nhiệm vụ", rarity: "uncommon" as const, bonusType: "exp_all", bonusValue: 3, owned: true, active: false },
  { id: "6", name: "Deploy Hawk", icon: "🦅", description: "Tăng 8% EXP từ Deployment", rarity: "rare" as const, bonusType: "exp_deploy", bonusValue: 8, owned: false, active: false },
  { id: "7", name: "Refactor Phoenix", icon: "🔥", description: "Tăng 12% EXP từ Refactor", rarity: "epic" as const, bonusType: "exp_refactor", bonusValue: 12, owned: false, active: false },
  { id: "8", name: "Git Turtle", icon: "🐢", description: "Tăng streak bonus thêm 2%", rarity: "common" as const, bonusType: "streak_bonus", bonusValue: 2, owned: false, active: false },
  { id: "9", name: "API Dolphin", icon: "🐬", description: "Tăng 7% lương thưởng", rarity: "rare" as const, bonusType: "salary", bonusValue: 7, owned: false, active: false },
  { id: "10", name: "Full Stack Unicorn", icon: "🦄", description: "Tăng 20% tất cả phần thưởng", rarity: "legendary" as const, bonusType: "all_bonus", bonusValue: 20, owned: false, active: false },
];

const RARITY_COLORS = {
  common: "border-gray-400/30 bg-gray-500/5",
  uncommon: "border-emerald-400/30 bg-emerald-500/5",
  rare: "border-blue-400/30 bg-blue-500/5",
  epic: "border-purple-400/30 bg-purple-500/5",
  legendary: "border-amber-400/30 bg-amber-500/5",
};

const RARITY_LABELS = {
  common: "Thường",
  uncommon: "Không phổ biến",
  rare: "Hiếm",
  epic: "Sử thi",
  legendary: "Huyền thoại",
};

export default function PetsPage() {
  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-pink-500" /> Thú Cưng
          </h1>
          <p className="text-sm text-muted-foreground">
            Thu thập thú cưng để nhận bonus đặc biệt. Chỉ có thể trang bị 1 thú cưng cùng lúc.
          </p>
        </div>
      </FadeIn>

      {/* Active pet */}
      {DEMO_PETS.filter((p) => p.active).map((pet) => (
        <FadeIn key={pet.id} delay={0.1}>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5 flex items-center gap-5">
              <Floating duration={3} distance={6}>
                <span className="text-5xl">{pet.icon}</span>
              </Floating>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold">{pet.name}</h3>
                  <Badge variant="career">Đang trang bị</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{pet.description}</p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ))}

      {/* All pets grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_PETS.map((pet, i) => (
          <FadeIn key={pet.id} delay={0.15 + i * 0.04}>
            <motion.div whileHover={{ y: -4 }}>
              <Card className={`${RARITY_COLORS[pet.rarity]} transition-all duration-200 ${!pet.owned ? "opacity-60 grayscale hover:grayscale-0 hover:opacity-100" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Floating duration={4 + i * 0.5} distance={4}>
                      <span className="text-3xl">{pet.icon}</span>
                    </Floating>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold">{pet.name}</h3>
                        {pet.active && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                      </div>
                      <Badge variant={pet.rarity === "legendary" ? "legend" : pet.rarity === "epic" ? "career" : "secondary"} className="text-[10px] mb-2">
                        {RARITY_LABELS[pet.rarity]}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{pet.description}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs">
                        <Zap className="h-3 w-3 text-amber-500" />
                        <span className="text-amber-500 font-medium">+{pet.bonusValue}%</span>
                      </div>
                    </div>
                  </div>
                  {pet.owned && !pet.active && (
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                      Trang bị
                    </Button>
                  )}
                  {!pet.owned && (
                    <div className="mt-3 text-center text-xs text-muted-foreground">
                      🔒 Chưa sở hữu
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
