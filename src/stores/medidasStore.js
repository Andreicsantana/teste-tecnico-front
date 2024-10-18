import { defineStore } from 'pinia';


export const useMedidasStore = defineStore('medidas', {
  state: () => ({
    medidas: JSON.parse(localStorage.getItem('medidas')) || [],
  }),

  actions: {
   
    // Funçao para adição de novas medidas
    addMedida(medida) {
      const newId = this.medidas.length ? Math.max(...this.medidas.map(m => m.id)) + 1 : 1;
      const novaMedida = { ...medida, id: newId };
      this.medidas.push(novaMedida);
      this.saveToLocalStorage();
    },

    // Funçao que realiza a edição das medidas 
    updateMedida(updatedMedida) {
      const index = this.medidas.findIndex(m => m.id === updatedMedida.id);
      if (index !== -1) {
        this.medidas[index] = updatedMedida;
        this.saveToLocalStorage();
      }
    },

    saveToLocalStorage() {
      localStorage.setItem('medidas', JSON.stringify(this.medidas));
    }
  }
});