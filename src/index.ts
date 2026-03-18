import * as english from "./bangu/english";
import * as loglan from "./bangu/loglan";
import * as vrici from "./ceha/vrici";
import * as stressed from "./ceha/stressed";
import { preprocessing } from "./libs/camxes_preproc";
import { postprocessing as loglanPostprocess } from "./libs/loglan_postproc";
export { preprocessing } from "./libs/camxes_preproc";

import {
  search_selrafsi_from_rafsi2,
  jvozba as jvozba_local,
  jvokaha as jvokaha_local,
  jvokaha2 as jvokaha2_local,
  jvokaha_gui as jvokaha_gui_local,
} from "./sozysozbot_jvozba";
import {
  xugismu as xugismu_local,
  xulujvo as xulujvo_local,
} from "./cmaxes/xuvalsi";
import { parse as romoi_lahi_cmaxes_parse } from "./cmaxes/cmaxes";
import {
  zeizei as zeizei_local,
  rotpaci as rotpaci_local,
} from "./ceha/zeizei";
import { anji as anji_local } from "./ceha/anji";
import { modzi as modzi_local } from "./ceha/modzi";
import { lojban2ipa as lojban2ipa_local } from "./ceha/ipa";
import type { TePurciBeFiLaCmaxes } from "./types";
export type { TePurciBeFiLaCmaxes };

type IlmentufaPostproc = { postprocessing: (ast: unknown, mode: string) => string };
type IlmentufaCamxes = { parse: (text: string) => unknown };
type LoglytufaParse = (text: string, opts: { startRule: string }) => unknown;

async function getIlmentufaPostproc(): Promise<IlmentufaPostproc> {
  // @ts-expect-error - legacy JS lib, no declaration file
  const m = await import("../libs/ilmentufa/camxes_postproc.js");
  return m as unknown as IlmentufaPostproc;
}
async function getIlmentufaCamxes(): Promise<IlmentufaCamxes> {
  // @ts-expect-error - legacy JS lib, no declaration file
  const m = await import("../libs/ilmentufa/camxes.js");
  return m as unknown as IlmentufaCamxes;
}
async function getIlmentufaCamxesBeta(): Promise<IlmentufaCamxes> {
  // @ts-expect-error - legacy JS lib, no declaration file
  const m = await import("../libs/ilmentufa/camxes-beta.js");
  return m as unknown as IlmentufaCamxes;
}
async function getLoglytufaParse(): Promise<LoglytufaParse> {
  // @ts-expect-error - legacy JS lib, no declaration file
  const m = await import("../libs/loglytufa/loglan.js");
  return (m as unknown as { parse: LoglytufaParse }).parse;
}

export const romoi_lahi_cmaxes = (text: string): TePurciBeFiLaCmaxes => {
  try {
    const parsed = romoi_lahi_cmaxes_parse(text) as [string, string][];
    return { tcini: "snada", "te spuda": parsed, kampu: parsed };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { tcini: "fliba", "te spuda": msg, kampu: msg };
  }
};
export const cmaxes = ({
  te_gerna: text,
  versiio: _version = "index",
}: {
  te_gerna: string;
  versiio?: string;
}) => {
  try {
    const parsed = romoi_lahi_cmaxes_parse(text) as [string, string][];
    return { tcini: "snada", "te spuda": parsed, kampu: parsed };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    return { tcini: "fliba", "te spuda": err, kampu: err.toString() };
  }
};
export const jbopomofo = (text: string) => vrici.jbopomofo(text);

export const rukylermorna = (text: string) => stressed.lojban2ruk(text);

export const krulermorna = (text: string) => vrici.krulermorna(text);

export const tibetan = (text: string) => vrici.tibetan(text);

export const jvozba = (parts: string | string[]) => jvozba_local(parts);

export const jvokaha = (word: string) => jvokaha_local(word);

export const jvokaha2 = (word: string) => jvokaha2_local(word);

export const jvokaha_gui = (word: string) => jvokaha_gui_local(word);

export const rafsi = (word: string, dictionary?: string, lang?: string) =>
  english.rafsi(word, dictionary, xugismu, lang ?? "en");

export const selmaho = ({
  word,
  jsonDoc: dictionary,
  bangu: lang,
}: {
  word: string;
  jsonDoc?: string;
  bangu?: string;
}) => english.selmaho({ word, jsonDoc: dictionary, bangu: lang ?? "en" });
export const word = ({ word, jsonDoc: dictionary }: { word: string; jsonDoc?: unknown }) =>
  english.word({ word, jsonDoc: dictionary, bangu: "en" });
export const dump = ({ doc, bangu: lang }: { bangu?: string; doc?: unknown }) =>
  english.fastParse({ bangu: lang ?? "en", doc });

export const rafsi_giho_nai_se_rafsi = (
  word: string,
  dictionary?: string,
  lang?: string
) => english.rafsi_giho_nai_se_rafsi(word, dictionary, xugismu, lang);

export const xulujvo = (text: string) =>
  xulujvo_local(text, romoi_lahi_cmaxes);

export function xugismu(text: string) {
  return xugismu_local(text, romoi_lahi_cmaxes);
}

function formatParseError(error: unknown) {
  return {
    tcini: "fliba" as const,
    "te spuda": error,
    kampu: error instanceof Error ? error.toString() : String(error),
  };
}

export async function loglytufa_master(text: string): Promise<{
  tcini: string;
  "te spuda": unknown;
  kampu: unknown;
}> {
  try {
    const parse = await getLoglytufaParse();
    const ast = parse(text, { startRule: "phoneticutterance" });
    const parsed = loglanPostprocess(ast, { morphemes: true });
    return { tcini: "na djuno", "te spuda": parsed, kampu: parsed };
  } catch (error) {
    return formatParseError(error);
  }
}

export async function ilmentufa_off(
  text: string,
  mode?: string,
  preprocess?: boolean
): Promise<{ tcini: string; "te spuda": unknown; kampu: unknown }> {
  const input = preprocess ? preprocessing(text) : text;
  try {
    const postproc = await getIlmentufaPostproc();
    const camxes = await getIlmentufaCamxes();
    const ast = camxes.parse(input);
    const parsed = postproc.postprocessing(ast, mode ?? "MTC");
    return { tcini: "snada", "te spuda": parsed, kampu: parsed };
  } catch (error) {
    return formatParseError(error);
  }
}

export async function ilmentufa_exp(
  text: string,
  mode?: string,
  preprocess?: boolean
): Promise<{ tcini: string; "te spuda": unknown; kampu: unknown }> {
  const input = preprocess ? preprocessing(text) : text;
  try {
    const postproc = await getIlmentufaPostproc();
    const camxes = await getIlmentufaCamxesBeta();
    const ast = camxes.parse(input);
    const parsed = postproc.postprocessing(ast, mode ?? "MTC");
    return { tcini: "snada", "te spuda": parsed, kampu: parsed };
  } catch (error) {
    return formatParseError(error);
  }
}
export const zeizei = (text: string, returnFullInfo?: boolean) =>
  zeizei_local(text, romoi_lahi_cmaxes, search_selrafsi_from_rafsi2, returnFullInfo);

export const anji = (text: string) =>
  anji_local(text, zeizei, romoi_lahi_cmaxes);

export const modzi = (text: string, rawOutput?: boolean) =>
  modzi_local(text, zeizei, romoi_lahi_cmaxes, rawOutput ?? false);

export const lojban2ipa = (
  text: string,
  mode?: string,
  parser = romoi_lahi_cmaxes
): string => lojban2ipa_local(text, mode, parser);

export const rotpaci = (text: string) => rotpaci_local(text);

export const lojban2loglan = (text: string): string =>
  loglan.lojban2loglan(text, romoi_lahi_cmaxes);

export const loglan2lojban = (text: string): string =>
  loglan.loglan2lojban(text);

export const gloss = async (
  text: string,
  lang?: string,
  dictionary?: unknown,
  useParser = true
): Promise<string[]> =>
  (await english.gloss(
    text,
    lang ?? "en",
    (useParser ?? true) ? ilmentufa_off : false,
    dictionary
  )).filter((s): s is string => s != null && s !== "");

