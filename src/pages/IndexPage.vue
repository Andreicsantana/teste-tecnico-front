<template>
  <q-page style="display: flex; flex-direction: column; padding: 2rem;">
    
    <!-- Barra de tarefas com a input para pesquisas, icone do excel, icone de tela cheia, icone de menu
     e Botao para cadastro de nova media -->
    <q-toolbar style="gap: 1rem; background-color: white; height: 5rem; margin-bottom: 0.2rem;">
     
      <q-icon size="2rem">
        <img src="../img/excel.png" />
      </q-icon>

      
      <q-input filled style="width: 80%; background-color: white;" placeholder="Pesquisar...">
        
        <q-icon name="search" size="1.5rem" style="padding: 1rem; color: black" />
      </q-input>

      
      <q-btn label="CADASTRAR NOVO" @click="openModal" color="standard" text-color="blue" />
      
      <q-icon name="fullscreen" size="1.5rem" />
      <q-icon name="more_vert" size="1.5rem" />
    </q-toolbar>
    <!--  -->
    
    <!--Tabela com os props rows, columns, row-key e row-click
     rows = valor filtrado para mostrar somente ativos
     columns = recebe o array que indica como cada coluna deve se comportar
     row key = Informa que o campo id e unico
     row-click = Evento que realiza a ação da funcao handleRowClick-->
    <q-table 
      :rows="filteredRows" 
      :columns="columns" 
      row-key="id" 
      @row-click="handleRowClick" 
    ></q-table>
    <!--  -->

    <!--Modal para cadastrar ou editar medidas -->
    <q-dialog v-model="modalOpen">
      <q-card style="height: 70%; width: 50%;">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Editar Medida' : 'Cadastrar Medida' }}</div>
        </q-card-section>

      
        <q-card-section>
          <q-input v-model="form.codigo_erp" label="Código ERP" />
          <q-input v-model="form.sigla" label="Sigla" />
          <q-input v-model="form.descricao" label="Descrição" />
          <q-select v-model="form.status" :options="statusOptions" label="Status" />
        </q-card-section>

     
        <q-card-actions>
          <q-btn label="Salvar" @click="saveMeasure" color="secondary" />
          <q-btn label="Cancelar" @click="closeModal" style="background-color: red; color: white" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!--  -->
  </q-page>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { useMedidasStore } from '../stores/medidasStore'; 

export default defineComponent({
  name: 'IndexPage',
  setup() {
    
    const store = useMedidasStore(); 

    
    const columns = ref([
      { name: 'id', label: 'ID', align: 'left', field: 'id', sortable: true },
      { name: 'codigo_erp', label: 'Código ERP', align: 'left', field: 'codigo_erp', sortable: true },
      { name: 'sigla', label: 'Sigla', align: 'left', field: 'sigla', sortable: true },
      { name: 'descricao', label: 'Descrição', align: 'left', field: 'descricao', sortable: true },
      { name: 'status', label: 'Status', align: 'left', field: 'status', sortable: true }
    ]);

    // essa função recebe uma propriedade computada reativa que filta o array store.medidas
    // retornando somente as medidas em que o status seja true.
    const filteredRows = computed(() => {
      return store.medidas.filter(row => row.status);
    });

    
    const modalOpen = ref(false);
    
    
    const isEdit = ref(false);

    //form: refenrencia reativa que cria uma estrutura para armazenar dados do formulario.
    const form = ref({
      id: null,
      codigo_erp: '',
      sigla: '',
      descricao: '',
      status: true,
    });

    const statusOptions = [
      { label: 'Ativo', value: true },
      { label: 'Inativo', value: false }
    ];

    
    const openModal = () => {
      form.value = { id: null, codigo_erp: '', sigla: '', descricao: '', status: true }; //Reseta o Valor do Form, para inserção de novos valores
      isEdit.value = false;
      modalOpen.value = true;
    };

    
    const closeModal = () => {
      modalOpen.value = false;
    };

    // Salva a medida, verificando se é um novo cadastro ou edição
    const saveMeasure = () => {
      if (isEdit.value) {
        store.updateMedida(form.value);
      } else {
        store.addMedida(form.value);
      }
      closeModal(); 
    };

    // Funçao para abrir o modal de edição ao clicar em uma das linhas
    const handleRowClick = (row) => {
      form.value = { ...row }; // Preenche o formulário com os dados da linha clicada
      isEdit.value = true;     
      modalOpen.value = true; 
    };

    return {
      columns,
      filteredRows,
      modalOpen,
      openModal,
      closeModal,
      saveMeasure,
      form,
      isEdit,
      statusOptions,
      handleRowClick,
    };
  }
});
</script>