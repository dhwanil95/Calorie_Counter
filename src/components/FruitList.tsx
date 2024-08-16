import React from "react";
import { Fruit, JarItem } from "../types";
import "../styles/FruitList.css";

interface FruitListProps {
  fruits: Fruit[];
  jar: JarItem[];
  groupBy: string;
  collapsedGroups: { [key: string]: boolean };
  toggleGroupCollapse: (group: string) => void;
  addToJar: (fruit: Fruit, groupName?: string) => void;
  removeFromJar: (fruit: Fruit, groupName?: string) => void;
  setGroupBy: (groupBy: string) => void;
}

const GroupBySelect: React.FC<{
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
}> = ({ onChange, disabled }) => {
  return (
    <select onChange={onChange} className="group-by-select" disabled={disabled}>
      <option value="None">None</option>
      <option value="Family">Family</option>
      <option value="Order">Order</option>
      <option value="Genus">Genus</option>
    </select>
  );
};

const FruitList: React.FC<FruitListProps> = ({
  fruits,
  jar,
  groupBy,
  collapsedGroups,
  toggleGroupCollapse,
  addToJar,
  removeFromJar,
  setGroupBy,
}) => {
  const groupedFruits = (): { [key: string]: Fruit[] } => {
    if (groupBy === "None" || fruits.length === 0) {
      return {};
    }

    return fruits.reduce((groups: { [key: string]: Fruit[] }, fruit) => {
      const groupKey = fruit[groupBy.toLowerCase() as keyof Fruit] as string;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(fruit);
      return groups;
    }, {});
  };

  const groups = groupedFruits();

  return (
    <div className="fruit-list-container">
      <label htmlFor="group-by-select" className="group-by-label">
        Group Fruits By:
      </label>
      <GroupBySelect
        onChange={(e) => setGroupBy(e.target.value)}
        disabled={fruits.length === 0}
      />

      {fruits.length > 0 ? (
        <table className="fruit-table">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Calories</th>
              <th className="table-header"></th>
            </tr>
          </thead>
          <tbody>
            {groupBy === "None"
              ? fruits.map((fruit: Fruit, index: number) => (
                  <tr key={index}>
                    <td className="table-cell">{fruit.name}</td>
                    <td className="table-cell">{fruit.nutritions.calories}</td>
                    <td className="table-cell">
                      <div className="group-buttons">
                        <button
                          data-testid={`add-${fruit.name}`}
                          className="btn btn-add"
                          onClick={() => addToJar(fruit)}
                        >
                          Add
                        </button>
                        <button
                          data-testid={`remove-${fruit.name}`}
                          className={`btn btn-remove ${
                            !jar.find((item) => item.fruit.name === fruit.name)
                              ? "btn-disabled"
                              : ""
                          }`}
                          onClick={() => removeFromJar(fruit)}
                          disabled={
                            !jar.find((item) => item.fruit.name === fruit.name)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : Object.keys(groups).map((group, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td
                        className="group-header"
                        colSpan={3}
                        onClick={() => toggleGroupCollapse(group)}
                      >
                        <div className="group-buttons">
                          <span>{group}</span>
                          <div className="group-buttons">
                            <button
                              className="btn btn-add-all"
                              onClick={(e) => {
                                e.stopPropagation();
                                groups[group].forEach((fruit) =>
                                  addToJar(fruit, group)
                                );
                              }}
                            >
                              Add All
                            </button>
                            <button
                              className={`btn btn-remove-all ${
                                !groups[group].some((fruit) =>
                                  jar.find(
                                    (item) => item.fruit.name === fruit.name
                                  )
                                )
                                  ? "btn-disabled"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                groups[group].forEach((fruit) =>
                                  removeFromJar(fruit, group)
                                );
                              }}
                              disabled={
                                !groups[group].some((fruit) =>
                                  jar.find(
                                    (item) => item.fruit.name === fruit.name
                                  )
                                )
                              }
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                    {!collapsedGroups[group] &&
                      groups[group].map((fruit: Fruit, idx: number) => (
                        <tr key={idx}>
                          <td className="table-cell">{fruit.name}</td>
                          <td className="table-cell">
                            {fruit.nutritions.calories}
                          </td>
                          <td className="table-cell">
                            <div className="group-buttons">
                              <button
                                data-testid={`add-${fruit.name}`}
                                className="btn btn-add"
                                onClick={() => addToJar(fruit)}
                              >
                                Add
                              </button>
                              <button
                                data-testid={`remove-${fruit.name}`}
                                className={`btn btn-remove ${
                                  !jar.find(
                                    (item) => item.fruit.name === fruit.name
                                  )
                                    ? "btn-disabled"
                                    : ""
                                }`}
                                onClick={() => removeFromJar(fruit)}
                                disabled={
                                  !jar.find(
                                    (item) => item.fruit.name === fruit.name
                                  )
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))}
          </tbody>
        </table>
      ) : (
        <p className="no-fruits-message">No fruits available to display.</p>
      )}
    </div>
  );
};

export default FruitList;
