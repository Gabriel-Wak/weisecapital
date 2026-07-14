"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { moveLeadToStage } from "@/actions/crm.actions";
import { toast } from "sonner";

type Lead = {
  id: string;
  name: string;
  phone: string | null;
  source: string;
  property: { title: string } | null;
};

type Stage = {
  id: string;
  name: string;
  color: string;
  leads: Lead[];
};

function SortableLead({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: lead.id });

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="cursor-grab border-0 shadow-sm active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-medium">{lead.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {lead.phone && (
          <p className="text-xs text-muted-foreground">{lead.phone}</p>
        )}
        {lead.property && (
          <p className="mt-1 text-xs text-primary">{lead.property.title}</p>
        )}
        <Badge variant="outline" className="mt-2 text-xs">
          {lead.source}
        </Badge>
      </CardContent>
    </Card>
  );
}

function StageColumn({ stage }: { stage: Stage }) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });

  return (
    <div className="min-w-[280px] flex-shrink-0">
      <div className="mb-3 flex items-center gap-2">
        <div
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: stage.color }}
        />
        <h3 className="font-semibold">{stage.name}</h3>
        <Badge variant="secondary">{stage.leads.length}</Badge>
      </div>
      <SortableContext
        items={stage.leads.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`min-h-[200px] space-y-3 rounded-lg p-2 transition-colors ${
            isOver ? "bg-primary/5 ring-2 ring-primary/20" : ""
          }`}
        >
          {stage.leads.map((lead) => (
            <SortableLead key={lead.id} lead={lead} />
          ))}
          {stage.leads.length === 0 && (
            <p className="py-8 text-center text-xs text-muted-foreground">
              Arraste leads aqui
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function CrmKanban({ initialStages }: { initialStages: Stage[] }) {
  const [stages, setStages] = useState(initialStages);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function findStageByLeadId(leadId: string) {
    return stages.find((s) => s.leads.some((l) => l.id === leadId));
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const fromStage = findStageByLeadId(leadId);
    let toStageId = over.id as string;

    const overIsLead = stages.some((s) => s.leads.some((l) => l.id === toStageId));
    if (overIsLead) {
      toStageId = findStageByLeadId(toStageId)?.id ?? toStageId;
    }

    const toStage = stages.find((s) => s.id === toStageId);
    if (!fromStage || !toStage || fromStage.id === toStageId) return;

    const lead = fromStage.leads.find((l) => l.id === leadId);
    if (!lead) return;

    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id === fromStage.id) {
          return { ...stage, leads: stage.leads.filter((l) => l.id !== leadId) };
        }
        if (stage.id === toStageId) {
          return { ...stage, leads: [...stage.leads, lead] };
        }
        return stage;
      })
    );

    startTransition(async () => {
      const result = await moveLeadToStage(leadId, toStageId);
      if (!result.success) {
        toast.error(result.error);
        setStages(initialStages);
      }
    });
  }

  const activeLead = activeId
    ? stages.flatMap((s) => s.leads).find((l) => l.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <StageColumn key={stage.id} stage={stage} />
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <Card className="w-[280px] border-0 shadow-lg">
            <CardHeader className="p-4">
              <CardTitle className="text-sm">{activeLead.name}</CardTitle>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>
      {isPending && (
        <p className="text-xs text-muted-foreground">Salvando...</p>
      )}
    </DndContext>
  );
}
