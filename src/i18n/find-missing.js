const { writeFileSync } = require('fs');
const { resolve } = require('path');

const filenames = ['de', 'en', 'pl'].map(code => resolve(`${code}.json`));
const dicts = filenames.map(name => require(name));

// struct from {a:''}, {b:''} gives {a:true, b:true}
const struct = translations => {
  const union = translations.reduce((sum, translation) => ({ ...sum, ...translation }), {});
  return Object.entries(union).reduce((rest, [key, val]) => {
    if (typeof val === 'string') {
      return { ...rest, [key]: true }; // there's at least one translation
    }
    const nested = struct(translations.map(translation => translation[key]));
    return { ...rest, [key]: nested }; // there's nested object filled recursively
  }, {});
};

// fill {a:true, b:true} with {a:''} gives {a:'', b:false}
const fill = (reference, object = {}) => {
  return Object.keys(reference).reduce((acc, key) => {
    if (typeof object[key] === 'string') {
      return { ...acc, [key]: object[key] }; // hit
    }
    if (typeof reference[key] === 'object') {
      return { ...acc, [key]: fill(reference[key], object[key]) }; // nested object
    }
    return { ...acc, [key]: false }; // missing key
  }, {});
};

const reference = struct(dicts);

// objects filled with original translations or `false` for missing keys
const filled = dicts.map(dict => fill(reference, dict));

filenames.forEach((name, index) => {
  writeFileSync(name, JSON.stringify(filled[index], null, 2));
});
