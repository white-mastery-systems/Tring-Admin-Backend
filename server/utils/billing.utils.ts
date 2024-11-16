import stateCodeMap from "../../assets/state.json"

export const getStateCode = (stateName: string) => {
  const state = stateCodeMap.filter(i => i.name === stateName)[0]
  return state ? state.state_code : null
}