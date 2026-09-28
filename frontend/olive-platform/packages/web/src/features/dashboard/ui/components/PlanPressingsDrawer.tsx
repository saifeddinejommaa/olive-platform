import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import styles from "../styles/dashboard.module.css";

import { GetOliveLots } from "@olive-platform/core/features/oliveLots/domain/usecases/GetOliveLots";
import { SkipOliveLotAnalysis } from "@olive-platform/core/features/oliveLots/domain/usecases/SkipOliveLotAnalysis";
import type { OliveLot } from "@olive-platform/core/features/oliveLots/domain/entities/OliveLot";
import {
  buildProposedPressings,
  schedulePressings,
} from "@olive-platform/core/features/oliveLots/domain/PressingPlanner";
import { CreatePressingOperation } from "@olive-platform/core/features/production/domain/useCases/CreatePressingOperation";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import { formatDate, toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { useSeasonStore } from "../../../../stores/SeasonStore";

type Props = {
  open: boolean;
  onClose: () => void;
  // Appelé après création : rafraîchit le tableau de bord.
  onCompleted: () => void;
};

type Result = { ok: boolean; message?: string };

const DEFAULT_CAPACITY_KG = 2000;

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} kg`;

export default function PlanPressingsDrawer({ open, onClose, onCompleted }: Props) {
  const season = useSeasonStore((state) =>
    state.seasons.find((item) => item.id === state.selectedSeasonId),
  );

  const [lots, setLots] = useState<OliveLot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState("");
  const [capacity, setCapacity] = useState(String(DEFAULT_CAPACITY_KG));
  const [excluded, setExcluded] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<Record<string, Result>>({});
  const [skippingId, setSkippingId] = useState<number | null>(null);

  const loadLots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setLots(await GetOliveLots({ available: true }));
    } catch (e: any) {
      setLots([]);
      setError(e?.message ?? "Impossible de charger les lots d'olives.");
    } finally {
      setLoading(false);
    }
  }, []);

  // À l'ouverture : on repart de zéro (début aujourd'hui, borné à la campagne).
  useEffect(() => {
    if (!open) return;

    const today = toDateOnlyString(new Date());
    const start =
      season && (today < season.startDate || today > season.endDate)
        ? season.startDate
        : today;

    setStartDate(start);
    setCapacity(String(DEFAULT_CAPACITY_KG));
    setExcluded([]);
    setOverrides({});
    setResults({});
    loadLots();
  }, [open, season, loadLots]);

  const proposals = useMemo(() => buildProposedPressings(lots), [lots]);
  const selected = proposals.filter((pressing) => !excluded.includes(pressing.key));

  const dates = useMemo(
    () => schedulePressings(selected, startDate, Number(capacity) || 0, overrides),
    [selected, startDate, capacity, overrides],
  );

  // Pressions hors campagne : refusées par l'API, donc non créées.
  const isOutOfSeason = (date: string | undefined) =>
    !!season && !!date && (date < season.startDate || date > season.endDate);

  const toCreate = selected.filter(
    (pressing) => !results[pressing.key]?.ok && !isOutOfSeason(dates[pressing.key]),
  );
  const totalKg = toCreate.reduce((total, pressing) => total + pressing.totalKg, 0);
  const plannedDates = toCreate.map((pressing) => dates[pressing.key]).sort();

  const pendingLots = lots.filter((lot) => lot.toAnalysis && lot.remainingKg > 0);

  const toggle = (key: string) =>
    setExcluded((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );

  const skipAnalysis = async (lotId: number) => {
    setSkippingId(lotId);

    try {
      await SkipOliveLotAnalysis(lotId);
      await loadLots();
    } catch (e: any) {
      toast.error(e?.message ?? "Impossible de passer le lot sans analyse.");
    } finally {
      setSkippingId(null);
    }
  };

  // POC : une création par pression (pas de transaction globale).
  const handleConfirm = async () => {
    setRunning(true);
    let created = 0;
    let failed = 0;

    for (const pressing of toCreate) {
      try {
        await CreatePressingOperation({
          plannedDate: new Date(`${dates[pressing.key]}T00:00:00`).toISOString(),
          status: ProductionStatus.Planned,
          startTime: null,
          endTime: null,
          oliveQuantityKg: pressing.totalKg,
          oilQuantityLiters: null,
          notes: "Planifiée depuis le tableau de bord.",
          inputs: pressing.lots.map((lot) => ({
            lotId: lot.id,
            quantityKg: lot.remainingKg,
          })),
        });

        created++;
        setResults((current) => ({ ...current, [pressing.key]: { ok: true } }));
      } catch (e: any) {
        failed++;
        setResults((current) => ({
          ...current,
          [pressing.key]: { ok: false, message: e?.message ?? "Erreur" },
        }));
      }
    }

    setRunning(false);
    onCompleted();

    if (failed === 0) {
      toast.success(`${created} pression${created > 1 ? "s" : ""} planifiée${created > 1 ? "s" : ""}.`);
      onClose();
    } else {
      toast.error(`${created} créée(s), ${failed} en erreur : voir le détail.`);
    }
  };

  return (
    <Drawer
      open={open}
      width={820}
      title="Planifier des pressions"
      description="Une pression par source et par variété, des olives les plus anciennes aux plus récentes, réparties selon la capacité journalière du moulin."
      onClose={running ? () => undefined : onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={running}>
            Annuler
          </Button>

          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={running || loading || toCreate.length === 0}
          >
            {running
              ? "Création..."
              : `Créer ${toCreate.length} pression${toCreate.length > 1 ? "s" : ""}`}
          </Button>
        </>
      }
    >
      <div className={styles.planBody}>
        {/* PARAMÈTRES */}
        <div className={styles.planSettings}>
          <TextInput
            label="Début"
            type="date"
            value={startDate}
            min={season?.startDate}
            max={season?.endDate}
            disabled={running}
            onChange={(event) => setStartDate(event.target.value)}
          />

          <TextInput
            label="Capacité du moulin (kg / jour)"
            type="number"
            min="1"
            value={capacity}
            disabled={running}
            onChange={(event) => setCapacity(event.target.value)}
          />
        </div>

        {loading && <div className={styles.panelMeta}>Chargement des lots...</div>}
        {error && <div className={styles.planError}>{error}</div>}

        {/* PROPOSITIONS */}
        {!loading && !error && (
          <>
            <div className={styles.planSummary}>
              <strong>
                {toCreate.length} pression{toCreate.length > 1 ? "s" : ""}
              </strong>
              <span>{formatKg(totalKg)}</span>
              {plannedDates.length > 0 && (
                <span>
                  du {formatDate(plannedDates[0])} au{" "}
                  {formatDate(plannedDates[plannedDates.length - 1])}
                </span>
              )}
            </div>

            {proposals.length === 0 ? (
              <div className={styles.panelMeta}>
                Aucun lot prêt à presser sur cette campagne.
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th} />
                    <th className={styles.th}>Source</th>
                    <th className={styles.th}>Lots</th>
                    <th className={styles.th} style={{ textAlign: "right" }}>Quantité</th>
                    <th className={styles.th}>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {proposals.map((pressing) => {
                    const isExcluded = excluded.includes(pressing.key);
                    const date = dates[pressing.key];
                    const result = results[pressing.key];
                    const outOfSeason = !isExcluded && isOutOfSeason(date);

                    return (
                      <tr
                        key={pressing.key}
                        className={isExcluded ? styles.planRowExcluded : undefined}
                      >
                        <td className={styles.td}>
                          <input
                            type="checkbox"
                            checked={!isExcluded}
                            disabled={running || result?.ok}
                            onChange={() => toggle(pressing.key)}
                          />
                        </td>

                        <td className={styles.td}>
                          <strong>{pressing.sourceReference}</strong>
                          <div className={styles.planMeta}>
                            {pressing.sourceType === 1 ? "Récolte" : "Achat"}
                            {pressing.varietyId
                              ? ` · ${getOliveVarietyLabel(pressing.varietyId)}`
                              : ""}
                          </div>
                          {result && (
                            <div
                              className={
                                result.ok ? styles.planResultOk : styles.planResultError
                              }
                            >
                              {result.ok ? "Pression créée" : result.message}
                            </div>
                          )}
                        </td>

                        <td className={styles.td}>
                          {pressing.lots.length} lot{pressing.lots.length > 1 ? "s" : ""}
                          <div className={styles.planMeta}>
                            {pressing.lots.map((lot) => lot.reference).join(", ")}
                          </div>
                        </td>

                        <td className={styles.td} style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          {formatKg(pressing.totalKg)}
                        </td>

                        <td className={styles.td}>
                          {isExcluded ? (
                            <span className={styles.planMeta}>Exclue</span>
                          ) : (
                            <>
                              <input
                                type="date"
                                className={styles.planDate}
                                value={date ?? ""}
                                min={season?.startDate}
                                max={season?.endDate}
                                disabled={running || result?.ok}
                                onChange={(event) =>
                                  setOverrides((current) => ({
                                    ...current,
                                    [pressing.key]: event.target.value,
                                  }))
                                }
                              />
                              {outOfSeason && (
                                <div className={styles.planResultError}>Hors campagne</div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {/* LOTS EN ATTENTE D'ANALYSE */}
            {pendingLots.length > 0 && (
              <div className={styles.planPending}>
                <div className={styles.planPendingTitle}>
                  En attente d'analyse — non planifiés ({pendingLots.length} lot
                  {pendingLots.length > 1 ? "s" : ""})
                </div>

                {pendingLots.map((lot) => (
                  <div key={lot.id} className={styles.planPendingRow}>
                    <span>
                      <strong>{lot.reference}</strong>
                      <span className={styles.planMeta}>
                        {" "}· {lot.sourceReference ?? "-"} · {formatKg(lot.remainingKg)}
                      </span>
                    </span>

                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={running || skippingId === lot.id}
                      onClick={() => skipAnalysis(lot.id)}
                    >
                      {skippingId === lot.id ? "..." : "Passer sans analyse"}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <DrawerConfirmationNotice title="Création">
              Chaque pression est créée au statut « Planifiée » et réserve ses
              lots. Les pressions sont créées une par une : en cas d'erreur,
              celles déjà créées sont conservées.
            </DrawerConfirmationNotice>
          </>
        )}
      </div>
    </Drawer>
  );
}
