import type { OwidRoot } from '../types/owid';

let _root: OwidRoot | undefined;
let _promise: Promise<void> | undefined;

const OWID_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

const load = async () => {
  const res = await fetch(OWID_URL);
  const json = (await res.json()) as OwidRoot;
  _root = json;
};

export const owidResource = {
  read(): OwidRoot {
    if (_root) return _root;
    if (!_promise) _promise = load();
    throw _promise;
  },
};
