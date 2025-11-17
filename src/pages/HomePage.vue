<template>
  <section class="page">
    <h1>Конструктор отчётов</h1>

    <div class="grid">
      <!-- Источники данных -->
      <div class="card">
        <h2>Источник данных</h2>
        <select v-model="dataSource">
          <option disabled value="">Выберите источник</option>
          <option value="acts">Акты</option>
          <option value="plans">Планы</option>
          <option value="defects">Дефекты</option>
          <option value="kpi">KPI</option>
        </select>
      </div>

      <!-- Визуализация -->
      <div class="card">
        <h2>Тип визуализации</h2>
        <select v-model="vizType">
          <option value="table">Таблица</option>
          <option value="bar">Столбчатая диаграмма</option>
          <option value="line">Линейная диаграмма</option>
          <option value="pie">Круговая диаграмма</option>
        </select>
      </div>

      <!-- Фильтры -->
      <div class="card">
        <h2>Фильтры</h2>
        <input v-model="filters.period" placeholder="Период: 2025-01..2025-12" />
        <input v-model="filters.area" placeholder="Участок/зона" />
        <input v-model="filters.object" placeholder="Объект/ID" />
      </div>
    </div>

    <div class="actions">
      <button @click="run">Сформировать</button>
      <button @click="saveTemplate">Сохранить как шаблон</button>
    </div>

    <div class="result">
      <pre v-if="vizType === 'table'">{{ result }}</pre>
      <div v-else>Заглушка визуализации: {{ vizType }}</div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { api } from '@/shared/api/http'

const dataSource = ref('')
const vizType = ref('table')
const filters = ref({ period: '', area: '', object: '' })
const result = ref([])

async function run() {
  // Бэкенд на dev доступен через Vite proxy: /api/...
  const { data } = await api.get('/reports/preview', {
    params: {
      source: dataSource.value,
      viz: vizType.value,
      period: filters.value.period,
      area: filters.value.area,
      object: filters.value.object,
    },
  })
  result.value = data
}

function saveTemplate() {
  // TODO: POST /api/report-templates
  alert('Шаблон сохранён (заглушка)')
}
</script>

<style scoped>
.page {
  padding: 16px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px;
}
.actions {
  margin: 16px 0;
  display: flex;
  gap: 8px;
}
.result {
  border-top: 1px solid #e5e7eb;
  padding-top: 12px;
}
</style>
