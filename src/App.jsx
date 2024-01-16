// import { useEffect, useRef, useState } from 'react';
// import axios from "axios";
// import './App.css';
// function App() {
//   const inputField = useRef();
//   const [users, setUsers] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [isInputFocused, setIsInputFocused] = useState(false);


//   useEffect(()=>{
//     async function getData(){    
//       const data = await axios.get("https://randomuser.me/api/?results=15")
//       console.log(data.data.results);
//       setUsers(data.data.results);
//       setFilteredData(data.data.results);
//     }
//     getData();
//   }, []);

//   function filterData(e){
//     console.log(e.target.value);
//     const value = e.target.value.toLowerCase();
//     filter(value);
//   }

//   function filter(value){
//     const filteredUsers = users.filter((user)=>{
//       return user.name.first.toLowerCase().includes(value);
//     });
//     setFilteredData(filteredUsers);
//   }

//   function handleSelectUser(user){
//     setSelectedUsers([...selectedUsers, user]);
//     //pop from users array
//     users.splice(users.indexOf(user), 1);
//     inputField.current.value = "";
//     setFilteredData(users);
//     //inputField.current.value = "";
//     inputField.current.focus();
//   }

//   function handleRemoveChip(index){
//     const user = selectedUsers[index];
//     //push to users array
//     users.push(user);
//     if(inputField.current.value === ""){
//       setFilteredData(users);
//     }
//     else{
//       filter(inputField.current.value.toLowerCase());
//     }
//     //remove from selectedUsers array
//     selectedUsers.splice(index, 1);
//     setSelectedUsers([...selectedUsers]);
//   }


//   return (
//     <>
//       <fieldset>
//         {selectedUsers.map((user, index) => (
//           <div key={index} className="chip">
//             <img src={user.picture.thumbnail} alt="" className='chip-img'/>
//             <span className='chip-name'>{user.name.first}</span>
//             <button className="remove-icon" onClick={() => handleRemoveChip(index)}>
//               X
//             </button>
//           </div>
//         ))}

      
      
//       <input placeholder='Enter the name' className='input-field' onChange={filterData} type='text' ref={inputField} onKeyDown={(e) => {
//         if (e.key === 'Enter' && filteredData.length > 0) {
//           handleSelectUser(filteredData[0]);
//         }
//       }}
//       onFocus={() => setIsInputFocused(true)}
//       on
//        />
//       </fieldset>
//       {isInputFocused && (
//           <div className="dropdown-list">
//             {filteredData.map((user) => (
//               <div key={user.login.uuid}>
//                 <button className="user" onClick={() => handleSelectUser(user)}>
//                   <img className="user-img" src={user.picture.large} alt="" />
//                   <p>
//                     <span className="user-name">{user.name.first}</span>{' '}
//                     <span className="user-mail">{user.email}</span>
//                   </p>
//                 </button>
//               </div>
//             ))}
//           </div>
//       )}
// {/* 
//       {filteredData.map((user)=>{
//         return (
//           <div key={user.login.uuid}>
//             <button className='user' onClick={()=>{
//               handleSelectUser(user);
//             }}>
//               <img className='user-img' src={user.picture.large} alt="" />
//               <p><span className='user-name'>{user.name.first}</span> <span className='user-mail'>{user.email}</span></p>
//             </button>
//           </div>
//         )
//       })} */}
//     </>
//   )
// }

// export default App

// ChipComponent.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // You can use TailwindCss/SCSS styles here

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [chips, setChips] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    // Filter items based on input value
    const newFilteredItems = items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()));
    setFilteredItems(newFilteredItems);
  }, [inputValue]);

  const highlightMatch = (item) => {
    const lowerInputValue = inputValue.toLowerCase();
    const lowerItem = item.toLowerCase();
    const index = lowerItem.indexOf(lowerInputValue);

    if (index !== -1) {
      const partBeforeMatch = item.substring(0, index);
      const matchedPart = item.substring(index, index + inputValue.length);
      const partAfterMatch = item.substring(index + inputValue.length);
      return (
        <span>
          {partBeforeMatch}
          <strong>{matchedPart}</strong>
          {partAfterMatch}
        </span>
      );
    } else {
      return item;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleItemClick = (item) => {
    // Add item to chips and remove from filtered items
    setChips(prevChips => [...prevChips, { id: Date.now(), label: item }]);
    setFilteredItems(prevItems => prevItems.filter(filteredItem => filteredItem !== item));
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleChipRemove = (id) => {
    // Remove chip and add item back to filtered items
    setChips(prevChips => prevChips.filter(chip => chip.id !== id));
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e) => {
    // Bonus Task: Handle backspace for deleting the last chip
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      handleChipRemove(lastChip.id);
    }
  };

  const items = ['Aniket', 'Manoj', 'John', 'Jane', 'Andy']; // Your list of items

  return (
    <div>
      <div className="chips-container">
        {chips.map(chip => (
          <div key={chip.id} className="chip">
            {chip.label}
            <span className="remove-icon" onClick={() => handleChipRemove(chip.id)}>
              X
            </span>
          </div>
        ))}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Type to filter items"
      />
      <div className="item-list">
        {filteredItems.map(item => (
          <div key={item} className="item" onClick={() => handleItemClick(item)}>
            {highlightMatch(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

