import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface IFood {
  id: number;
  name: string;
  description: string;
  available: boolean;
  image: string;
  price: number;
}

export const Dashboard = () => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function getFoods() {
      const response = await api.get<IFood[]>('/foods');
      setFoods(response.data);
    }
    getFoods();
  }, []);

  const handleAddFood = async (food: IFood) => {
    // const { foods } = this.state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);

      // this.setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateFood = async (food: IFood) => {
    // const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);

      // this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteFood = async (id: number) => {
    // const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);

    // this.setState({ foods: foodsFiltered });
  };

  const toggleModal = () => {
    // const { modalOpen } = this.state;

    setModalOpen(!modalOpen);

    // this.setState({ modalOpen: !modalOpen });
  };

  const toggleEditModal = () => {
    // const { editModalOpen } = this.state;

    setEditModalOpen(!editModalOpen);

    // this.setState({ editModalOpen: !editModalOpen });
  };

  const handleEditFood = (food: IFood) => {
    // this.setState({ editingFood: food, editModalOpen: true });
    setEditingFood(food);
    setEditModalOpen(true);
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid='foods-list'>
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       foods: [],
//       editingFood: {},
//       modalOpen: false,
//       editModalOpen: false,
//     };
//   }

// async componentDidMount() {
//   const response = await api.get('/foods');

//   this.setState({ foods: response.data });
// }

// handleAddFood = async (food) => {
//   const { foods } = this.state;

//   try {
//     const response = await api.post('/foods', {
//       ...food,
//       available: true,
//     });

//     this.setState({ foods: [...foods, response.data] });
//   } catch (err) {
//     console.log(err);
//   }
// };

// handleUpdateFood = async (food) => {
//   const { foods, editingFood } = this.state;

//   try {
//     const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
//       ...editingFood,
//       ...food,
//     });

//     const foodsUpdated = foods.map((f) =>
//       f.id !== foodUpdated.data.id ? f : foodUpdated.data
//     );

//     this.setState({ foods: foodsUpdated });
//   } catch (err) {
//     console.log(err);
//   }
// };

// handleDeleteFood = async (id) => {
//   const { foods } = this.state;

//   await api.delete(`/foods/${id}`);

//   const foodsFiltered = foods.filter((food) => food.id !== id);

//   this.setState({ foods: foodsFiltered });
// };

// toggleModal = () => {
//   const { modalOpen } = this.state;

//   this.setState({ modalOpen: !modalOpen });
// };

// toggleEditModal = () => {
//   const { editModalOpen } = this.state;

//   this.setState({ editModalOpen: !editModalOpen });
// };

//   handleEditFood = (food) => {
//     this.setState({ editingFood: food, editModalOpen: true });
//   };

//   render() {
//     const { modalOpen, editModalOpen, editingFood, foods } = this.state;

//     return (
//       <>
//         <Header openModal={this.toggleModal} />
//         <ModalAddFood
//           isOpen={modalOpen}
//           setIsOpen={this.toggleModal}
//           handleAddFood={this.handleAddFood}
//         />
//         <ModalEditFood
//           isOpen={editModalOpen}
//           setIsOpen={this.toggleEditModal}
//           editingFood={editingFood}
//           handleUpdateFood={this.handleUpdateFood}
//         />

//         <FoodsContainer data-testid='foods-list'>
//           {foods &&
//             foods.map((food) => (
//               <Food
//                 key={food.id}
//                 food={food}
//                 handleDelete={this.handleDeleteFood}
//                 handleEditFood={this.handleEditFood}
//               />
//             ))}
//         </FoodsContainer>
//       </>
//     );
//   }
// }

export default Dashboard;
