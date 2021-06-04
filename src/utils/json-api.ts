function extractRelations(dataRelationships: JsonApiRelationships = {}, included: JsonApiRecord[] = [], depth = 3) {
  if (!depth) return null;
  const entries = Object.entries(dataRelationships);

  const relationships: any = {};

  const findIncludedObject = (foreignKey: JsonApiKey) => {
    const { id: foreignId, type: foreignType } = foreignKey;
    const found = included.find(
      ({ id: includedId, type: includedType }: any) => includedId === foreignId && includedType === foreignType,
    );
    return found;
  };

  for (const [relationName, foreignKey] of entries) {
    if (Array.isArray(foreignKey.data)) {
      const foundObjects = foreignKey.data
        .map(key => {
          const object = findIncludedObject(key);
          if (!object) return null;
          const relationships = extractRelations(object.relationships, included, depth - 1);
          return { id: key.id, ...object.attributes, ...relationships };
        })
        .filter(obj => Boolean(obj));
      relationships[relationName] = foundObjects;
    } else if (foreignKey.data) {
      const object = findIncludedObject(foreignKey.data);
      if (!object) continue;
      const relationshipsRelationships = extractRelations(object.relationships, included, depth - 1);
      relationships[relationName] = { id: foreignKey.data.id, ...object.attributes, ...relationshipsRelationships };
    }
  }
  return relationships;
}

interface JsonApiKey {
  id: string;
  type: string;
  data?: JsonApiKey | JsonApiKey[];
}

type JsonApiRelationships = {
  [key: string]: JsonApiKey;
};

interface JsonApiRecord extends JsonApiKey {
  attributes: { [key: string]: string | number | null };
  relationships: JsonApiRelationships;
}

interface JsonApiObject {
  data: JsonApiRecord;
  included?: JsonApiRecord[];
}

interface JsonApiArray {
  data: JsonApiRecord[];
  included?: JsonApiRecord[];
}

const handleJsonObject = ({ data, included }: JsonApiObject): Object => {
  return {
    id: data.id,
    ...data.attributes,
    ...extractRelations(data.relationships, included),
  };
};

export type JsonApiResponse = JsonApiObject | JsonApiArray;

export default ({ data = [], included = [] }: JsonApiResponse) => {
  const deserialized = Array.isArray(data)
    ? data.map(data => handleJsonObject({ data, included }))
    : handleJsonObject({ data: data || {}, included: included || [] });
  return deserialized;
};
