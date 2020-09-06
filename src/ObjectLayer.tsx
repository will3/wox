import QuadMap, { QuadChunk as QuadMapColumn } from "./utils/QuadMap";
import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useStore } from "./store";

export interface ObjectLayerProps<T> {
  map: QuadMap<T>;
  renderItem(item: T): any;
}

export default function ObjectLayer<T>({
  map,
  renderItem,
}: ObjectLayerProps<T>) {
  let [counter, setCounter] = useState(0);
  const version = useStore(state => map.version);

  useEffect(() => {
    setCounter(counter++);
  }, [version]);

  return (
    <>
      {_.map(map.columns, (column) => (
        <ObjectLayerColumn key={column.key} column={column} renderItem={renderItem} />
      ))}
    </>
  );
}

export interface ObjectLayerColumn<T> {
  column: QuadMapColumn<T>;
  renderItem(item: T): any;
}

export function ObjectLayerColumn<T>({
  column,
  renderItem,
}: ObjectLayerColumn<T>) {
  return <>{_.map(column.items, (item) => renderItem(item.value))}</>;
}
