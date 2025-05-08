// Salvar dados no Local Storage

export const setItem = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value); 
      localStorage.setItem(key, serializedValue); 
    } catch (error) {
      console.error("Erro ao salvar no Local Storage", error);
    }
  };
  
  export const getItem = (key) => {
    try {
      const serializedValue = localStorage.getItem(key); 
      return serializedValue ? JSON.parse(serializedValue) : null; 
    } catch (error) {
      console.error("Erro ao obter do Local Storage", error);
      return null;
    }
  };

  export const removeItem = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erro ao remover do Local Storage", error);
    }
  };
  