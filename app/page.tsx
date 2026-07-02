"use client";

import { useMemo, useState } from "react";
import FacilityPanel from "@/components/facility/FacilityPanel";
import MapCanvas from "@/components/map/MapCanvas";
import PulseHeader from "@/components/PulseHeader";
import { useFacilities } from "@/hooks/useFacilities";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function CommandCenter() {
  const { facilities, loading } = useFacilities();
  const recommendations = useRecommendations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => facilities.find((f) => f.id === selectedId) ?? null, [facilities, selectedId]);

  return (
    <div className="h-dvh flex flex-col">
      <PulseHeader facilities={facilities} pendingRecommendations={recommendations.length} />

      <main className="flex-1 min-h-0 flex gap-2 p-2">
        <section className="flex-1 min-w-0">
          {loading ? (
            <div className="h-full rounded border border-line bg-surface-1 p-4">
              <div className="rail-label">Loading district…</div>
            </div>
          ) : (
            <MapCanvas facilities={facilities} selectedId={selectedId} onSelect={setSelectedId} />
          )}
        </section>

        <aside className="w-[380px] shrink-0 flex flex-col gap-2 min-h-0 overflow-y-auto">
          {/* InsightsRail (Task 8) mounts here. */}
          {selected ? (
            <FacilityPanel facility={selected} />
          ) : (
            <div className="rounded border border-line bg-surface-1 p-3">
              <div className="rail-label mb-2">Facility</div>
              <div className="text-ink-3 text-xs">Select a facility on the map.</div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
