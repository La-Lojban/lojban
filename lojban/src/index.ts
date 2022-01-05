import * as english from "./bangu/english"
import * as vrici from "./ceha/vrici"
import { preprocessing } from "./libs/camxes_preproc"
export { preprocessing } from "./libs/camxes_preproc"

import {
  search_selrafsi_from_rafsi2,
  jvozba as jvozba_local,
  jvokaha as jvokaha_local,
  jvokaha2 as jvokaha2_local,
  jvokaha_gui as jvokaha_gui_local,
} from "./sozysozbot_jvozba"
import {
  xugismu as xugismu_local,
  xulujvo as xulujvo_local,
} from "./cmaxes/xuvalsi"
import { parse as romoi_lahi_cmaxes_parse } from './cmaxes/cmaxes'
import { zeizei as zeizei_local, rotpaci as rotpaci_local } from "./ceha/zeizei"
import { anji as anji_local } from './ceha/anji'
import { modzi as modzi_local } from './ceha/modzi'

export const romoi_lahi_cmaxes = (te_gerna: string) => {
  try {
    const terspuda = romoi_lahi_cmaxes_parse(te_gerna)
    return { tcini: "snada", "te spuda": terspuda, kampu: terspuda }
  } catch (e) {
    return { tcini: "fliba", "te spuda": e, kampu: e.toString() }
  }
}
export const cmaxes = ({
  te_gerna,
  versiio = "index",
}: {
  te_gerna: string
  versiio: string
}) => {
  try {
    const terspuda = romoi_lahi_cmaxes_parse(te_gerna)
    return { tcini: "snada", "te spuda": terspuda, kampu: terspuda }
  } catch (e) {
    return { tcini: "fliba", "te spuda": e, kampu: e.toString() }
  }
}
export const jbopomofo = (te_gerna: string) => vrici.jbopomofo(te_gerna)

export const rukylermorna = (te_gerna: string) => vrici.rukylermorna(te_gerna)

export const krulermorna = (te_gerna: string) => vrici.krulermorna(te_gerna)

export const jvozba = (selcmima: string) => jvozba_local(selcmima)

export const jvokaha = (valsi: string) => jvokaha_local(valsi)

export const jvokaha2 = (valsi: string) => jvokaha2_local(valsi)

export const jvokaha_gui = (valsi: string) => jvokaha_gui_local(valsi)

export const rafsi = (valsi: string, jsonDoc?: string, bangu?: string) =>
  english.rafsi(valsi, jsonDoc, xugismu, bangu)

export const selmaho = ({
  word,
  jsonDoc,
  bangu,
}: {
  word: string
  jsonDoc?: string
  bangu?: string
}) => english.selmaho({ word, jsonDoc, bangu })
export const word = ({ word, jsonDoc }: { word: string; jsonDoc?: string }) =>
  english.word({ word, jsonDoc })
export const dump = ({ doc, bangu }: { bangu?: string; doc?: string }) =>
  english.fastParse({ bangu, doc })

export const rafsi_giho_nai_se_rafsi = (
  valsi: string,
  jsonDoc?: string,
  bangu?: string
) => english.rafsi_giho_nai_se_rafsi(valsi, jsonDoc, xugismu, bangu)

export const xulujvo = (te_gerna: string) =>
  xulujvo_local(te_gerna, romoi_lahi_cmaxes)

export function xugismu(te_gerna: string) {
  return xugismu_local(te_gerna, romoi_lahi_cmaxes)
}

export function ilmentufa_off(te_gerna: any, mode: any, preprocess: any) {
  if (preprocess)
    te_gerna = preprocessing(te_gerna)
  try {
    const terspuda = require("../libs/ilmentufa/camxes_postproc.js").postprocessing(
      require("../libs/ilmentufa/camxes.js").parse(te_gerna),
      mode
    )
    return { tcini: "snada", "te spuda": terspuda, kampu: terspuda }
  } catch (e) {
    return { tcini: "fliba", "te spuda": e, kampu: e.toString() }
  }
}
export function ilmentufa_exp(te_gerna: any, mode: any, preprocess: any) {
  if (preprocess)
    te_gerna = preprocessing(te_gerna)
  try {
    const terspuda = require("../libs/ilmentufa/camxes_postproc.js").postprocessing(
      require("../libs/ilmentufa/camxes-beta.js").parse(te_gerna),
      mode
    )
    return { tcini: "snada", "te spuda": terspuda, kampu: terspuda }
  } catch (e) {
    return { tcini: "fliba", "te spuda": e, kampu: e.toString() }
  }
}
export const zeizei = (te_gerna: any, returnFullInfo?: any) =>
  zeizei_local(
    te_gerna,
    romoi_lahi_cmaxes,
    jvokaha_gui_local,
    xulujvo_local,
    jvokaha_local,
    search_selrafsi_from_rafsi2,
    returnFullInfo
  )

export const anji = (te_gerna: string) =>
  anji_local(te_gerna, zeizei, romoi_lahi_cmaxes)

export const modzi = (te_gerna: any, rawOutput?: boolean) =>
  modzi_local(te_gerna, zeizei, romoi_lahi_cmaxes, rawOutput)

export const rotpaci = (te_gerna: string) => rotpaci_local(te_gerna)

export const lojban2loglan = (te_gerna: string) => {
  return require("./bangu/loglan").lojban2loglan(
    te_gerna,
    romoi_lahi_cmaxes
  )
}
export const loglan2lojban = (te_gerna: string) =>
  require("./bangu/loglan").loglan2lojban(te_gerna)

export const gloss = (
  te_gerna: string,
  bangu?: string,
  jsonDoc?: any,
  pilno_logentufa = true
) =>
  english.gloss(
    te_gerna,
    bangu,
    pilno_logentufa ? ilmentufa_off : false,
    jsonDoc
  )

export const wiktionary = (te_gerna: any, bangu: any, akti: any) =>
  english.wiktionary(te_gerna, bangu, akti)
