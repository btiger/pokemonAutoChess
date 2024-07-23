import React, { Dispatch, SetStateAction } from "react"
import { IPokemonConfig } from "../../../../../models/mongo-models/user-metadata"
import { PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX } from "../../../../../models/precomputed/precomputed-emotions"
import { getEmotionCost } from "../../../../../types/Config"
import { Emotion } from "../../../../../types/enum/Emotion"
import { Pkm } from "../../../../../types/enum/Pokemon"
import { getPortraitSrc } from "../../../utils"
import { cc } from "../../utils/jsx"
import "./pokemon-collection-item.css"

export default function PokemonCollectionItem(props: {
  name: Pkm
  index: string
  config: IPokemonConfig | undefined
  filter: string
  shinyOnly: boolean
  setPokemon: Dispatch<SetStateAction<Pkm | "">>
}) {
  if (
    props.index in PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX === false ||
    PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index].includes(1) === false
  ) {
    return null
  }

  const { dust, emotions, shinyEmotions } = props.config ?? {
    dust: 0,
    emotions: [] as Emotion[],
    shinyEmotions: [] as Emotion[]
  }
  const isUnlocked =
    (!props.shinyOnly && emotions?.length > 0) || shinyEmotions?.length > 0
  const availableEmotions = Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[props.index]?.[i] === 1
  )

  const canUnlock = availableEmotions.some(
    (e) =>
      (emotions.includes(e) === false &&
        dust >= getEmotionCost(e, false) &&
        !props.shinyOnly) ||
      (shinyEmotions.includes(e) === false && dust >= getEmotionCost(e, true))
  )

  if (props.filter === "unlocked" && !isUnlocked) return null
  if (props.filter === "unlockable" && !canUnlock) return null
  if (props.filter === "locked" && isUnlocked) return null

  return (
    <div
      className={cc("my-box", "clickable", "pokemon-collection-item", {
        unlocked: isUnlocked,
        unlockable: canUnlock,
        shimmer: canUnlock
      })}
      onClick={() => {
        props.setPokemon(props.name)
      }}
    >
      <img
        src={getPortraitSrc(
          props.index,
          props.config?.selectedShiny,
          props.config?.selectedEmotion
        )}
        loading="lazy"
      />
      <p>
        <span>{props.config ? props.config.dust : 0}</span>
        <img src={getPortraitSrc(props.index)} />
      </p>
    </div>
  )
}
