import React from "react";
import { JarItem } from "../types";
import "../styles/Jar.css";

interface JarProps {
  jar: JarItem[];
  handleEmptyJar: () => void;
}

const Jar: React.FC<JarProps> = ({ jar, handleEmptyJar }) => {
  return (
    <div className="jar-container">
      <h2 className="jar-title">Jar</h2>
      <button
        className={`empty-jar-btn ${jar.length === 0 ? "disabled" : ""}`}
        onClick={handleEmptyJar}
        data-testid="empty-jar"
        disabled={jar.length === 0}
      >
        Empty Jar
      </button>
      {jar.length > 0 ? (
        <div className="jar-table-container">
          <table className="jar-table">
            <thead>
              <tr>
                <th>Fruit Name</th>
                <th>Quantity</th>
                <th>Calories</th>
              </tr>
            </thead>
            <tbody>
              {jar.map((item, index) => (
                <tr key={index}>
                  <td>{item.fruit.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.fruit.nutritions.calories * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-fruits-message">No fruits added to the jar yet.</p>
      )}

      <p className="total-calories">
        Total Calories:{" "}
        {jar.reduce(
          (total, item) =>
            total + item.fruit.nutritions.calories * item.quantity,
          0
        )}
      </p>
    </div>
  );
};

export default Jar;
