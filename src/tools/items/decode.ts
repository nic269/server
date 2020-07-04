const ITEM_INDICATOR = 64; // lower version use 32

const hex2dec = (hex: string) => parseInt(hex, 16);

const hexDecode = (hex: string) => {
  // 64 in the patern === ITEM_INDICATOR
  if (!/^[a-f0-9]{64}$/i.test(hex) || hex.toLowerCase() === 'f'.repeat(ITEM_INDICATOR)) {
    return false;
  }

  const opts = hex2dec(hex.substr(2, 2));
  const exos = hex2dec(hex.substr(14, 2));

  const excellent = Array(6)
    .fill('')
    .map((_, i) => (exos >> i) & 0b1);

  const group = hex2dec(hex.substr(18, 1));
  const id = hex2dec(hex.substr(0, 2));
  const luck = !!((opts >> 2) & 0b1);
  const level = (opts >> 3) & 0b1111;
  const skill = !!((opts >> 7) & 0b1);
  const options = (opts & 0b11) | (((exos >> 6) & 0b1) << 2);
  const ancient = hex2dec(hex.substr(16, 2));
  const serial = hex.substr(6, 8) + hex.substr(32, 8); // lower version doesn't have "hex.substr(32, 8)"
  const durability = hex2dec(hex.substr(4, 2));
  const pink = !!hex2dec(hex.substr(19, 1));
  const harmony = {
    type: hex2dec(hex.substr(20, 1)),
    level: hex2dec(hex.substr(21, 1))
  };

  return {
    group,
    id,
    luck,
    level,
    skill,
    options,
    ancient,
    serial,
    durability,
    excellent,
    pink,
    harmony
  };
};

export default hexDecode;
