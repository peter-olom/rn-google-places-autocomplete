export interface lengthAndOffset {
  length: number;
  offset: number;
}

export interface offsetAndValue {
  [index: number]: {
    offset: number;
    value: number;
  }
}

export interface structured_formatting {
  main_text: string;
  main_text_matched_substrings: Array<lengthAndOffset>
  secondary_text: string;
}

export interface prediction {
  description: string;
  distance_meters?: number;
  id: string;
  matched_substrings: Array<lengthAndOffset>;
  place_id: string;
  reference: string;
  structured_formatting?: structured_formatting;
  terms: Array<offsetAndValue>
  types: Array<string>
}

export interface GoogleAutocompleteResult{
  error_message: string;
  predictions: Array<prediction>;
  status: string;
}

export interface latlng {
  latitude: number;
  longitude: number;
}

export type supportedLanguages = 'af' | 'ja' | 'sq' | 'kn' | 'am' | 'kk' | 'ar' | 'km' | 'hy' | 'ko' | 'az' | 'ky' | 'eu' | 'lo' | 'be' | 'lv' | 'bn' | 'lt' | 'bs' | 'mk' | 'bg' | 'ms' | 'my' | 'ml' | 'ca' | 'mr' | 'zh' | 'mn' | 'zh-CN' | 'ne' | 'zh-HK' | 'no' | 'zh-TW' | 'pl' | 'hr' | 'pt' | 'cs' | 'pt-BR' | 'da' | 'pt-PT' | 'nl' | 'pa' | 'en' | 'ro' | 'en-AU' | 'ru' | 'en-GB' | 'sr' | 'et' | 'si' | 'fa' | 'sk' | 'fi' | 'sl' | 'fil' | 'es' | 'fr' | 'es-419' | 'fr-CA' | 'sw' | 'gl' | 'sv' | 'ka' | 'ta' | 'de' | 'te' | 'el' | 'th' | 'gu' | 'tr' | 'iw' | 'uk' | 'hi' | 'ur' | 'hu' | 'uz' | 'is' | 'vi' | 'id' | 'zu' | 'it';
export type googlePlacesType = 'geocode' | 'address' | 'establishment' | 'regions' | 'cities';
export type iso3166 = 'ad'|'ae'|'af'|'ag'|'ai'|'al'|'am'|'ao'|'aq'|'ar'|'as'|'at'|'au'|'aw'|'ax'|'az'|'ba'|'bb'|'bd'|'be'|'bf'|'bg'|'bh'|'bi'|'bj'|'bl'|'bm'|'bn'|'bo'|'bq'|'br'|'bs'|'bt'|'bv'|'bw'|'by'|'bz'|'ca'|'cc'|'cd'|'cf'|'cg'|'ch'|'ci'|'ck'|'cl'|'cm'|'cn'|'co'|'cr'|'cu'|'cv'|'cw'|'cx'|'cy'|'cz'|'de'|'dj'|'dk'|'dm'|'do'|'dz'|'ec'|'ee'|'eg'|'eh'|'er'|'es'|'et'|'fi'|'fj'|'fk'|'fm'|'fo'|'fr'|'ga'|'gb'|'gd'|'ge'|'gf'|'gg'|'gh'|'gi'|'gl'|'gm'|'gn'|'gp'|'gq'|'gr'|'gs'|'gt'|'gu'|'gw'|'gy'|'hk'|'hm'|'hn'|'hr'|'ht'|'hu'|'id'|'ie'|'il'|'im'|'in'|'io'|'iq'|'ir'|'is'|'it'|'je'|'jm'|'jo'|'jp'|'ke'|'kg'|'kh'|'ki'|'km'|'kn'|'kp'|'kr'|'kw'|'ky'|'kz'|'la'|'lb'|'lc'|'li'|'lk'|'lr'|'ls'|'lt'|'lu'|'lv'|'ly'|'ma'|'mc'|'md'|'me'|'mf'|'mg'|'mh'|'mk'|'ml'|'mm'|'mn'|'mo'|'mp'|'mq'|'mr'|'ms'|'mt'|'mu'|'mv'|'mw'|'mx'|'my'|'mz'|'na'|'nc'|'ne'|'nf'|'ng'|'ni'|'nl'|'no'|'np'|'nr'|'nu'|'nz'|'om'|'pa'|'pe'|'pf'|'pg'|'ph'|'pk'|'pl'|'pm'|'pn'|'pr'|'ps'|'pt'|'pw'|'py'|'qa'|'re'|'ro'|'rs'|'ru'|'rw'|'sa'|'sb'|'sc'|'sd'|'se'|'sg'|'sh'|'si'|'sj'|'sk'|'sl'|'sm'|'sn'|'so'|'sr'|'ss'|'st'|'sv'|'sx'|'sy'|'sz'|'tc'|'td'|'tf'|'tg'|'th'|'tj'|'tk'|'tl'|'tm'|'tn'|'to'|'tr'|'tt'|'tv'|'tw'|'tz'|'ua'|'ug'|'um'|'us'|'uy'|'uz'|'va'|'vc'|'ve'|'vg'|'vi'|'vn'|'vu'|'wf'|'ws'|'ye'|'yt'|'za'|'zm'|'zw';

export interface GoogleParameters {
  apiKey: string;
  offset?: number;
  origin?: latlng;
  location?: latlng;
  radius?: number;
  language?: supportedLanguages;
  types?: googlePlacesType,
  components?: Array<iso3166>;
  strictbounds?: boolean;
}

export interface TokenGenerator {
  (): string | Promise<string>;
}
