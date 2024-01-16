import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import './App.css';
function App() {
  const inputField = useRef();
  const isBackspacePressed = useRef(false);
  const [users, setUsers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [highlightedChipIndex, setHighlightedChipIndex] = useState(-1);


  useEffect(()=>{
    async function getData(){    
      const data = await axios.get("https://randomuser.me/api/?results=50");
      console.log(data.data.results);
      setUsers(data.data.results);
      setFilteredData(data.data.results);
    }
    getData();
  }, []);



  function filterData(e){
    console.log(e.target.value);
    const value = e.target.value.toLowerCase();
    filter(value);
  }

  function filter(value){
    const filteredUsers = users.filter((user)=>{
      return user.name.first.toLowerCase().includes(value);
    });
    setFilteredData(filteredUsers);
  }
  const highlightMatch = (item) => {
        const lowerInputValue = inputField.current.value.toLowerCase();
        const lowerItem = item.toLowerCase();
        const index = lowerItem.indexOf(lowerInputValue);
    
        if (index !== -1) {
          const partBeforeMatch = item.substring(0, index);
          const matchedPart = item.substring(index, index + inputField.current.value.length);
          const partAfterMatch = item.substring(index + inputField.current.value.length);
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


  function handleSelectUser(user){
    isBackspacePressed.current = false;
    highlightedChipIndex !== -1 && setHighlightedChipIndex(-1);
    setSelectedUsers([...selectedUsers, user]);
    //pop from users array
    users.splice(users.indexOf(user), 1);
    inputField.current.value = "";
    setFilteredData(users);
    //inputField.current.value = "";
    inputField.current.focus();
  }

  function handleRemoveChip(index){
    const user = selectedUsers[index];
    //push to users array
    users.push(user);
    if(inputField.current.value === ""){
      setFilteredData(users);
    }
    else{
      filter(inputField.current.value.toLowerCase());
    }
    //remove from selectedUsers array
    selectedUsers.splice(index, 1);
    setSelectedUsers([...selectedUsers]);
  }

  function focusInputField(){
    inputField.current.focus();
  }

  


  return (
    <div>
      <fieldset onClick={focusInputField}>
        {selectedUsers.map((user, index) => (
          <div key={index} className={`chip ${index === highlightedChipIndex ? 'highlight' : ''}`}>
            <img src={user.picture.thumbnail} alt="" className='chip-img'/>
            <span className='chip-name'>{user.name.first}</span>
            <button className="remove-icon" onClick={() => handleRemoveChip(index)}>
              X
            </button>
          </div>
        ))}

      
      
      <input placeholder='Enter the name' className='input-field' onChange={filterData} type='text' ref={inputField} onKeyDown={(e) => {
        if (e.key === 'Enter' && filteredData.length > 0) {
          handleSelectUser(filteredData[0]);
        }
        if (e.key === 'Backspace' && e.target.value === '' && selectedUsers.length > 0) {
          if(isBackspacePressed.current){
            handleRemoveChip(selectedUsers.length - 1);
            setHighlightedChipIndex(-1);
            isBackspacePressed.current = false;
          }
          else{
            // highlight last chip
            const lastChipIndex = selectedUsers.length - 1;
            setHighlightedChipIndex(lastChipIndex);
            isBackspacePressed.current = true;
          }
        }
      }}
      onFocus={() => setIsInputFocused(true)}
      
       />
      </fieldset>
      {isInputFocused  && (
         filteredData.length === 0 ? <div className='dropdown-list'><div className='error'>No users found</div></div> : 
          <div className="dropdown-list">
            {filteredData.map((user) => (
              <div key={user.login.uuid} className='users'>
                <button className="user" onClick={() => handleSelectUser(user)}>
                  <img className="user-img" src={user.picture.large} alt="" />
                  <p>
                    <span className="user-name">{highlightMatch(user.name.first)}</span>
                    <span className="user-mail">{user.email}</span>
                  </p>
                </button>
              </div>
            ))}
          </div>
        
        
          
      )}

    </div>
  )
}

export default App
