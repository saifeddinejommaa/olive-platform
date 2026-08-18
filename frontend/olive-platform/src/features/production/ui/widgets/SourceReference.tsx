import { useEffect, useState } from 'react'

import { Autocomplete } from '../../../../common/widgets/autoComplete/AutoComplete'

import { useHarvestsAutocomplete } from '../../../harvests/ui/hooks/UseHarvestsAutoComplete'

import { UseOlivePurchaseAutoComplete } from '../../../olivePurchases/ui/hooks/UseOlivePurchaseAutoComplete'

import { GetOlivePurchaseItems } from '../../../olivePurchases/domain/usecases/GetOlivePurchaseItems'

import type { OlivePurchaseItem } from '../../../olivePurchases/domain/entities/OlivePurchaseItem'

import type { InputSourceType } from './InputTypes'

// ============================================================
// TYPES
// ============================================================

type SourceReferenceProps = {
  sourceType: InputSourceType

  value: string

  error?: string

  onChange: (
    value: string
  ) => void

  onSelect: (
    source: SourceOption
  ) => void
}

// ============================================================
// SOURCE OPTION
// ============================================================

export type SourceOption = {
  id: number

  reference: string

  purchaseItemIds?: number[]

  quantityKg?: number
}

// ============================================================
// COMPONENT
// ============================================================

export default function SourceReference({
  sourceType,
  value,
  error,
  onChange,
  onSelect,
}: SourceReferenceProps) {

  const isHarvest =
    sourceType === 'harvest'

  // ==========================================================
  // PURCHASE
  // ==========================================================

  const [
    selectedPurchaseId,
    setSelectedPurchaseId,
  ] = useState<number | null>(null)

  const [
    selectedPurchaseNumber,
    setSelectedPurchaseNumber,
  ] = useState<string>('')

  // ==========================================================
  // PURCHASE ITEMS
  // ==========================================================

  const [
    purchaseItems,
    setPurchaseItems,
  ] = useState<OlivePurchaseItem[]>([])

  const [
    selectedItemIds,
    setSelectedItemIds,
  ] = useState<number[]>([])

  const [
    loadingItems,
    setLoadingItems,
  ] = useState(false)

  // ==========================================================
  // LOAD PURCHASE ITEMS
  // ==========================================================

  useEffect(() => {

    if (!selectedPurchaseId) {

      setPurchaseItems([])

      setSelectedItemIds([])

      return
    }

    const loadItems = async () => {

      setLoadingItems(true)

      try {

        const data =
          await GetOlivePurchaseItems(
            selectedPurchaseId,
            {
              pageNumber: 1,
              pageSize: 100,
            }
          )

        setPurchaseItems(
          data.items
        )

        setSelectedItemIds([])

      } catch (error) {

        console.error(
          'Erreur lors du chargement des lots',
          error
        )

        setPurchaseItems([])

        setSelectedItemIds([])

      } finally {

        setLoadingItems(false)

      }
    }

    loadItems()

  }, [
    selectedPurchaseId,
  ])

  useEffect(() => {

    setSelectedPurchaseId(null)

    setSelectedPurchaseNumber('')

    setPurchaseItems([])

    setSelectedItemIds([])

}, [sourceType])

  // ==========================================================
  // PURCHASE ITEM SELECTION
  // ==========================================================

  const handleToggleItem = (
    itemId: number
  ) => {

    setSelectedItemIds(
      current => {

        const alreadySelected =
          current.includes(itemId)

        if (alreadySelected) {

          return current.filter(
            id => id !== itemId
          )

        }

        return [
          ...current,
          itemId,
        ]
      }
    )
  }

  // ==========================================================
  // SELECT ALL
  // ==========================================================

  const handleSelectAll = () => {

    if (
      selectedItemIds.length ===
      purchaseItems.length
    ) {

      setSelectedItemIds([])

      return
    }

    setSelectedItemIds(
      purchaseItems.map(
        item => item.id
      )
    )
  }

  // ==========================================================
  // NOTIFY PARENT
  // ==========================================================

  useEffect(() => {

    if (
      isHarvest ||
      !selectedPurchaseId
    ) {
      return
    }

    const selectedItems =
      purchaseItems.filter(
        item =>
          selectedItemIds.includes(
            item.id
          )
      )

    const quantityKg =
      selectedItems.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.agreedQuantityKg ?? 0
          ),
        0
      )

    onSelect({
      id:
        selectedPurchaseId,

      reference:
        selectedPurchaseNumber,

      purchaseItemIds:
        selectedItemIds,

      quantityKg,
    })

  }, [
    isHarvest,
    selectedPurchaseId,
    selectedPurchaseNumber,
    selectedItemIds,
    onSelect,
  ])

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >

      {/* ======================================================
          HARVEST
      ====================================================== */}

      {isHarvest && (

        <Autocomplete
          useSearch={
            useHarvestsAutocomplete
          }

          getLabel={(
            harvest
          ) =>
            harvest.harvestNumber
          }

          onSelect={(
            harvest
          ) => {

            onSelect({
              id:
                harvest.id,

              reference:
                harvest.harvestNumber,
            })

          }}

          placeholder="Rechercher une récolte..."

          width={400}
        />

      )}

      {/* ======================================================
          PURCHASE
      ====================================================== */}

      {!isHarvest && (

        <>

          <Autocomplete
            useSearch={
              UseOlivePurchaseAutoComplete
            }

            getLabel={(
              purchase
            ) =>
              purchase.purchaseNumber
            }

            onSelect={(
              purchase
            ) => {

              setSelectedPurchaseId(
                purchase.id
              )

              setSelectedPurchaseNumber(
                purchase.purchaseNumber
              )

              setSelectedItemIds([])

              setPurchaseItems([])

              onSelect({
                id:
                  purchase.id,

                reference:
                  purchase.purchaseNumber,

                purchaseItemIds:
                  [],
              })

            }}

            placeholder="Rechercher un achat..."

            width={400}
          />

          {/* ==================================================
              PURCHASE ITEMS
          ================================================== */}

          {selectedPurchaseId && (

            <div
              style={{
                width: '100%',

                border:
                  '1px solid #ddd',

                borderRadius:
                  '8px',

                overflow:
                  'hidden',

                background:
                  '#fff',
              }}
            >

              {/* =================================================
                  COLUMN HEADER
              ================================================= */}

              <div
                style={{
                  display: 'grid',

                  gridTemplateColumns:
                    '50px 70px minmax(0, 1fr) 120px',

                  alignItems:
                    'center',

                  gap:
                    '12px',

                  padding:
                    '12px 16px',

                  background:
                    '#f7f7f7',

                  borderBottom:
                    '1px solid #ddd',

                  fontSize:
                    '13px',

                  fontWeight:
                    600,

                  color:
                    '#555',
                }}
              >

                {/* SELECT */}

                <div
                  style={{
                    textAlign:
                      'center',
                  }}
                >
                  Sélection
                </div>

                {/* ID */}

                <div>
                  ID
                </div>

                {/* DESCRIPTION */}

                <div>
                  Description / Variété
                </div>

                {/* QUANTITY */}

                <div
                  style={{
                    textAlign:
                      'right',
                  }}
                >
                  Quantité
                </div>

              </div>

              {/* =================================================
                  LOADING
              ================================================= */}

              {loadingItems && (

                <div
                  style={{
                    padding:
                      '20px',

                    textAlign:
                      'center',

                    color:
                      '#666',
                  }}
                >
                  Chargement des lots...
                </div>

              )}

              {/* =================================================
                  EMPTY
              ================================================= */}

              {!loadingItems &&
                purchaseItems.length === 0 && (

                  <div
                    style={{
                      padding:
                        '20px',

                      textAlign:
                        'center',

                      color:
                        '#666',
                    }}
                  >
                    Aucun lot trouvé pour cet achat.
                  </div>

                )}

              {/* =================================================
                  ITEMS
              ================================================= */}

              {!loadingItems &&
                purchaseItems.length > 0 && (

                  <div>

                    {purchaseItems.map(
                      item => {

                        const isSelected =
                          selectedItemIds.includes(
                            item.id
                          )

                        return (

                          <label
                            key={item.id}

                            style={{
                              display:
                                'grid',

                              gridTemplateColumns:
                                '50px 70px minmax(0, 1fr) 120px',

                              alignItems:
                                'center',

                              gap:
                                '12px',

                              padding:
                                '14px 16px',

                              borderBottom:
                                '1px solid #eee',

                              cursor:
                                'pointer',

                              background:
                                isSelected
                                  ? '#f5f5f5'
                                  : '#fff',
                            }}
                          >

                            {/* CHECKBOX */}

                            <div
                              style={{
                                display:
                                  'flex',

                                justifyContent:
                                  'center',
                              }}
                            >

                              <input
                                type="checkbox"

                                checked={
                                  isSelected
                                }

                                onChange={() =>
                                  handleToggleItem(
                                    item.id
                                  )
                                }

                                style={{
                                  width:
                                    '18px',

                                  height:
                                    '18px',

                                  cursor:
                                    'pointer',
                                }}
                              />

                            </div>

                            {/* ID */}

                            <div
                              style={{
                                fontWeight:
                                  600,
                              }}
                            >
                              #{item.id}
                            </div>

                            {/* DESCRIPTION / VARIETY */}

                            <div
                              style={{
                                display:
                                  'flex',

                                flexDirection:
                                  'column',

                                gap:
                                  '3px',

                                minWidth:
                                  0,
                              }}
                            >

                              <span
                                style={{
                                  fontWeight:
                                    500,

                                  overflow:
                                    'hidden',

                                  textOverflow:
                                    'ellipsis',

                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {
                                  item.description ??
                                  item.varietyId ??
                                  'Lot'
                                }
                              </span>

                              {item.varietyId &&
                                item.description && (

                                  <span
                                    style={{
                                      fontSize:
                                        '12px',

                                      color:
                                        '#777',
                                    }}
                                  >
                                    {
                                      item.varietyId
                                    }
                                  </span>

                                )}

                            </div>

                            {/* QUANTITY */}

                            <div
                              style={{
                                fontWeight:
                                  600,

                                whiteSpace:
                                  'nowrap',

                                textAlign:
                                  'right',
                              }}
                            >
                              {
                                item.agreedQuantityKg
                              }{' '}
                              kg
                            </div>

                          </label>

                        )
                      }
                    )}

                  </div>

                )}

              {/* =================================================
                  FOOTER
              ================================================= */}

              {!loadingItems &&
                purchaseItems.length > 0 && (

                  <div
                    style={{
                      padding:
                        '12px 16px',

                      background:
                        '#fafafa',

                      borderTop:
                        '1px solid #ddd',

                      display:
                        'flex',

                      justifyContent:
                        'space-between',

                      alignItems:
                        'center',
                    }}
                  >

                    <span
                      style={{
                        fontSize:
                          '13px',

                        color:
                          '#666',
                      }}
                    >
                      {
                        purchaseItems.length
                      }{' '}
                      lot
                      {
                        purchaseItems.length > 1
                          ? 's'
                          : ''
                      }
                    </span>

                    <button
                      type="button"
                      onClick={
                        handleSelectAll
                      }
                      style={{
                        border:
                          'none',

                        background:
                          'transparent',

                        cursor:
                          'pointer',

                        fontSize:
                          '13px',

                        fontWeight:
                          500,
                      }}
                    >
                      {
                        selectedItemIds.length ===
                          purchaseItems.length
                          ? 'Tout désélectionner'
                          : 'Tout sélectionner'
                      }
                    </button>

                    <strong>
                      {
                        selectedItemIds.length
                      }{' '}
                      sélectionné
                      {
                        selectedItemIds.length > 1
                          ? 's'
                          : ''
                      }
                    </strong>

                  </div>

                )}

            </div>

          )}

        </>

      )}

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <span
          className="field-error"
        >
          {error}
        </span>

      )}

    </div>
  )
}