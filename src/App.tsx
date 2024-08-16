import React, { useState, useEffect } from "react";
import { getFruits } from "./services/api";
import Navbar from "./components/Navbar";
import FruitList from "./components/FruitList";
import Jar from "./components/Jar";
import Swal from "sweetalert2";
import { Fruit, JarItem } from "./types";

const App: React.FC = () => {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [jar, setJar] = useState<JarItem[]>([]);
  const [groupBy, setGroupBy] = useState<string>("None");
  const [collapsedGroups, setCollapsedGroups] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFetchError(false);

      try {
        const fruitsData: Fruit[] = await getFruits();

        if (Array.isArray(fruitsData) && fruitsData.length > 0) {
          setFruits(fruitsData);
        } else {
          throw new Error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Failed to fetch fruits:", error);
        setFetchError(true);

        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong while fetching the fruits. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleGroupCollapse = (group: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Add Fruit/Group to Jar
  const addToJar = (fruit: Fruit, groupName?: string) => {
    setJar((prevJar) => {
      try {
        const existingItem = prevJar.find(
          (item) => item.fruit.name === fruit.name
        );
        if (existingItem) {
          Swal.fire({
            icon: "success",
            title: groupName
              ? `${groupName} group added to the jar!`
              : `${fruit.name} quantity increased!`,
            showConfirmButton: false,
            timer: 1500,
          });
          return prevJar.map((item) =>
            item.fruit.name === fruit.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          Swal.fire({
            icon: "success",
            title: groupName
              ? `${groupName} group added to the jar!`
              : `${fruit.name} added to the jar!`,
            showConfirmButton: false,
            timer: 1500,
          });
          return [...prevJar, { fruit, quantity: 1 }];
        }
      } catch (error) {
        console.error("Failed to add fruit to jar:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to add the fruit to the jar. Please try again.",
        });

        return prevJar;
      }
    });
  };

  // Remove from the Jar
  const removeFromJar = (fruit: Fruit, groupName?: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: groupName
        ? `Do you really want to remove all fruits in the ${groupName} group from the jar?`
        : `Do you really want to remove one ${fruit.name} from the jar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        setJar((prevJar) => {
          try {
            if (groupName) {
              return prevJar.filter(
                (item) =>
                  item.fruit[groupBy.toLowerCase() as keyof Fruit] !== groupName
              );
            } else {
              return prevJar
                .map((item) =>
                  item.fruit.name === fruit.name
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
                )
                .filter((item) => item.quantity > 0);
            }
          } catch (error) {
            console.error("Failed to remove fruit from jar:", error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Failed to remove the fruit from the jar. Please try again.",
            });
            return prevJar;
          }
        });
      }
    });
  };

  // Handle Empty Jar Button
  const handleEmptyJar = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to empty the jar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, empty it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        setJar([]);
        Swal.fire("Emptied!", "Your jar has been emptied.", "success");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 pt-20 grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading && <p>Loading fruits...</p>}
        {fetchError && <p>Failed to load fruits. Please try again later.</p>}
        {!isLoading && !fetchError && (
          <>
            <FruitList
              fruits={fruits}
              jar={jar}
              groupBy={groupBy}
              collapsedGroups={collapsedGroups}
              toggleGroupCollapse={toggleGroupCollapse}
              addToJar={addToJar}
              removeFromJar={removeFromJar}
              setGroupBy={setGroupBy}
            />
            <Jar jar={jar} handleEmptyJar={handleEmptyJar} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
