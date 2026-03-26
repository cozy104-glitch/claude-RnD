"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/page-header";
import { KoreanCurrencyInput } from "@/components/proposal/korean-currency-input";
import type { PersonnelCost, EquipmentCost, ResearchBudget } from "@/lib/types/budget";
import {
  calculatePersonnelTotal,
  calculateDirectCostsSubtotal,
  calculateIndirectCosts,
  calculateTotalBudget,
  formatKRW,
} from "@/lib/budget/calculator";
import { useProposalStore } from "@/store/proposal-store";
import { useAutoSave } from "@/hooks/use-auto-save";

export default function BudgetPage() {
  const { currentProposal, updateSection, saveProposal } = useProposalStore();
  const budget = currentProposal?.sections.budget as ResearchBudget | undefined;

  const [personnelCosts, setPersonnelCosts] = useState<PersonnelCost[]>(
    budget?.directCosts.personnelCosts || []
  );
  const [equipmentCosts, setEquipmentCosts] = useState<EquipmentCost[]>(
    budget?.directCosts.equipmentCosts || []
  );
  const [indirectRate, setIndirectRate] = useState(budget?.indirectCosts.rate || 20);

  // 직접비 객체: useMemo로 안정화 — 참조가 안정적이어야 useAutoSave deps에서
  // 불필요한 재계산이 발생하지 않는다
  const directCosts = useMemo(() => ({
    personnelCosts,
    equipmentCosts,
    travelCosts: budget?.directCosts.travelCosts || [],
    materialCosts: budget?.directCosts.materialCosts || [],
    outsourcingCosts: budget?.directCosts.outsourcingCosts || [],
    otherCosts: budget?.directCosts.otherCosts || [],
    subtotal: 0,
  }), [personnelCosts, equipmentCosts, budget?.directCosts]);

  const directSubtotal = calculateDirectCostsSubtotal(directCosts);
  const indirectAmount = calculateIndirectCosts(directSubtotal, indirectRate);
  const totalBudget = calculateTotalBudget(directSubtotal, indirectAmount);

  // 인건비 행 추가
  const addPersonnel = () => {
    setPersonnelCosts([
      ...personnelCosts,
      { id: crypto.randomUUID(), name: "", role: "", monthlyRate: 0, months: 0, participationRate: 100, total: 0 },
    ]);
  };

  // 장비비 행 추가
  const addEquipment = () => {
    setEquipmentCosts([
      ...equipmentCosts,
      { id: crypto.randomUUID(), name: "", specification: "", quantity: 1, unitPrice: 0, total: 0, purpose: "" },
    ]);
  };

  // 예산 상태를 스토어에 동기화하는 함수 — useAutoSave와 수동 저장 모두 사용
  const persistBudget = () => {
    const updatedBudget: ResearchBudget = {
      totalAmount: totalBudget,
      directCosts: { ...directCosts, subtotal: directSubtotal },
      indirectCosts: { rate: indirectRate, amount: indirectAmount },
      annualBreakdown: budget?.annualBreakdown || [],
    };
    updateSection("budget", updatedBudget);
    saveProposal();
  };

  // 자동저장: 인건비/장비비/간접비율 변경 시 3초 후 자동 저장
  useAutoSave({ personnelCosts, equipmentCosts, indirectRate }, persistBudget);

  // 수동 저장 버튼용 — 토스트 포함
  const handleSave = () => {
    persistBudget();
    toast.success("연구예산이 저장되었습니다.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="연구예산"
        description="직접비 및 간접비를 편성합니다. 합계는 자동 계산됩니다."
      />

      {/* 인건비 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>인건비</CardTitle>
            <CardDescription>연구원별 인건비를 입력합니다.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addPersonnel}>
            <Plus className="mr-1 size-4" />
            추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>역할</TableHead>
                <TableHead className="text-right">월단가</TableHead>
                <TableHead className="text-right">개월</TableHead>
                <TableHead className="text-right">참여율(%)</TableHead>
                <TableHead className="text-right">소계</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnelCosts.map((cost, i) => {
                const total = calculatePersonnelTotal(cost);
                return (
                  <TableRow key={cost.id}>
                    <TableCell>
                      <Input
                        value={cost.name}
                        onChange={(e) => {
                          const next = [...personnelCosts];
                          next[i] = { ...cost, name: e.target.value };
                          setPersonnelCosts(next);
                        }}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={cost.role}
                        onChange={(e) => {
                          const next = [...personnelCosts];
                          next[i] = { ...cost, role: e.target.value };
                          setPersonnelCosts(next);
                        }}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={cost.monthlyRate || ""}
                        onChange={(e) => {
                          const next = [...personnelCosts];
                          next[i] = { ...cost, monthlyRate: Number(e.target.value) };
                          setPersonnelCosts(next);
                        }}
                        className="h-8 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={cost.months || ""}
                        onChange={(e) => {
                          const next = [...personnelCosts];
                          next[i] = { ...cost, months: Number(e.target.value) };
                          setPersonnelCosts(next);
                        }}
                        className="h-8 w-16 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={cost.participationRate}
                        onChange={(e) => {
                          const next = [...personnelCosts];
                          next[i] = { ...cost, participationRate: Number(e.target.value) };
                          setPersonnelCosts(next);
                        }}
                        className="h-8 w-16 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatKRW(total)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPersonnelCosts(personnelCosts.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 장비비 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>연구장비·재료비</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={addEquipment}>
            <Plus className="mr-1 size-4" />
            추가
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>장비명</TableHead>
                <TableHead className="text-right">수량</TableHead>
                <TableHead className="text-right">단가</TableHead>
                <TableHead className="text-right">소계</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipmentCosts.map((cost, i) => {
                const total = cost.quantity * cost.unitPrice;
                return (
                  <TableRow key={cost.id}>
                    <TableCell>
                      <Input
                        value={cost.name}
                        onChange={(e) => {
                          const next = [...equipmentCosts];
                          next[i] = { ...cost, name: e.target.value };
                          setEquipmentCosts(next);
                        }}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={cost.quantity}
                        onChange={(e) => {
                          const next = [...equipmentCosts];
                          next[i] = { ...cost, quantity: Number(e.target.value) };
                          setEquipmentCosts(next);
                        }}
                        className="h-8 w-16 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={cost.unitPrice || ""}
                        onChange={(e) => {
                          const next = [...equipmentCosts];
                          next[i] = { ...cost, unitPrice: Number(e.target.value) };
                          setEquipmentCosts(next);
                        }}
                        className="h-8 text-right"
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums">
                      {formatKRW(total)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEquipmentCosts(equipmentCosts.filter((_, j) => j !== i))}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator />

      {/* 예산 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>예산 요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>직접비 소계</span>
            <span className="font-semibold tabular-nums">{formatKRW(directSubtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>간접비</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={indirectRate}
                  onChange={(e) => setIndirectRate(Number(e.target.value))}
                  className="h-8 w-16 text-right"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
            <span className="font-semibold tabular-nums">{formatKRW(indirectAmount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>총 연구비</span>
            <span className="tabular-nums">{formatKRW(totalBudget)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave}>저장</Button>
      </div>
    </div>
  );
}
