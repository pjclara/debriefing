# SearchableMultiSelect - Componente Reutilizável

## 📋 Descrição

Um componente React de **autocomplete multiselect com search** que permite aos utilizadores procurar e selecionar múltiplos items de uma lista. As seleções aparecem como **tags/pills coloridas** que podem ser removidas com clique.

## ✨ Funcionalidades

- 🔍 **Search em tempo real** - Filtra items enquanto digita
- ✅ **Checkbox visual** - Indica items selecionados
- 🏷️ **Tags/Pills** - Mostra items selecionados como tags removíveis
- ❌ **Remover fácil** - Botão X em cada tag ou selecionar novamente
- 🎯 **Click outside** - Dropdown fecha automaticamente quando clica fora
- ♿ **Acessível** - Checkboxes funcionam normalmente
- 📱 **Responsivo** - Funciona em mobile/desktop
- 🎨 **Tailwind styled** - Estilos consistentes com a aplicação

## 📦 Props

```typescript
interface SearchableMultiSelectProps {
    options: Option[];              // Array de items disponiáveis
    selectedIds: (number|string)[]; // IDs dos items selecionados
    onSelectionChange: Function;    // Callback quando selection muda
    placeholder?: string;           // Placeholder do input
    className?: string;             // Classes CSS extras
    maxWidth?: string;              // Max width (default: max-w-md)
}

interface Option {
    id: number | string;    // ID único
    nome: string;           // Nome a mostrar
    [key: string]: any;     // Propriedades extras
}
```

## 🚀 Como Usar

### 1. Importar o componente

```typescript
import SearchableMultiSelect from '@/components/SearchableMultiSelect';
```

### 2. Usar no formulário (exemplo com consumíveis)

```typescript
<SearchableMultiSelect
    options={consumivel_tipos}  // Array de ConsumivelTipo
    selectedIds={data.b1 ?? []} // IDs selecionados
    onSelectionChange={(ids) => setData('b1', ids)}
    placeholder="Procurar pinças B1..."
/>
```

### 3. Com estado local (useState)

```typescript
const [selected, setSelected] = useState<number[]>([]);

<SearchableMultiSelect
    options={items}
    selectedIds={selected}
    onSelectionChange={setSelected}
/>
```

## 🎨 Customização

### Alterar cor das tags

No componente, procure a classe `bg-blue-100 text-blue-800` e altere para:

```typescript
// Tags azuis (default)
className="...bg-blue-100 text-blue-800..."

// Tags verdes
className="...bg-green-100 text-green-800..."

// Tags vermelho/laranja/roxo
className="...bg-red-100 text-red-800..."
className="...bg-orange-100 text-orange-800..."
className="...bg-purple-100 text-purple-800..."
```

### Alterar tamanho máximo do dropdown

```typescript
// Default: max-h-64 (256px)
// No componente, mude a classe na linha do dropdown:
className="...max-h-64 overflow-y-auto"

// Alternatives:
// max-h-96   (384px)
// max-h-full (100%)
```

### Alterar largura máxima

```typescript
<SearchableMultiSelect
    maxWidth="max-w-lg"   // Mais largo
    // ou
    maxWidth="max-w-sm"   // Mais apertado
    // ou
    maxWidth="w-full"     // Tamanho completo
/>
```

## 🔍 Exemplos de Uso Reais

### Exemplo 1: Campo de pinças no formulário Surgery

```typescript
<div className="space-y-2">
    <label className="font-semibold">Pinças B1</label>
    <SearchableMultiSelect
        options={consumivel_tipos.filter(c => c.categoria === 'pinça')}
        selectedIds={data.b1 ?? []}
        onSelectionChange={(ids) => setData('b1', ids)}
        placeholder="Procurar pinças..."
    />
</div>
```

### Exemplo 2: Lista de utilizadores para atribuição

```typescript
<SearchableMultiSelect
    options={usuarios}  // [{id: 1, nome: 'João'}, ...]
    selectedIds={selectedUsers}
    onSelectionChange={setSelectedUsers}
    placeholder="Procurar utilizadores..."
/>
```

### Exemplo 3: Tags/Departamentos

```typescript
<SearchableMultiSelect
    options={departamentos}
    selectedIds={data.departamentos_ids}
    onSelectionChange={(ids) => setData('departamentos_ids', ids)}
    maxWidth="max-w-full"
/>
```

## 🧪 Type Safety

O componente é totalmente tipado em TypeScript:

```typescript
// Interface Option
interface Option {
    id: number | string;
    nome: string;
    [key: string]: any;  // Propriedades adicionais permitidas
}

// Tipos de retorno
selectedIds: (number | string)[]  // Sempre array de IDs

// Callback tipado
onSelectionChange: (selectedIds: (number | string)[]) => void
```

## 🐛 Debugging

### Verificar items selecionados

```typescript
// No console, adicione:
console.log('Selecionados:', selectedIds);
console.log('Opções:', options);
console.log('Filtradas:', options.filter(o => selectedIds.includes(o.id)));
```

### Problema: Valores não persistem

**Causa:** O campo pode estar recebendo `null` ou `undefined` em vez de `array`.

**Solução:**

```typescript
selectedIds={data.b1 ?? []}  // ?? converte null/undefined em []
```

### Problema: Nenhuma opção aparece

**Causa:** Array `options` vazio ou não tem propriedade `nome`.

**Solução:**

```typescript
// Verificar no console
console.log(options);  // Deve ter [{id: ..., nome: ...}, ...]

// Ou transformar dados:
const mappedOptions = items.map(item => ({
    id: item.id,
    nome: item.title,  // Se propriedade diferente
}));
```

## 🔄 Integração com Inertia.useForm()

Funciona perfeitamente com o hook `useForm` do Inertia:

```typescript
import { useForm } from '@inertiajs/react';

export default function MyForm() {
    const { data, setData } = useForm({
        b1: [],
        b2: [],
    });

    return (
        <SearchableMultiSelect
            options={consumivel_tipos}
            selectedIds={data.b1 ?? []}
            onSelectionChange={(ids) => setData('b1', ids)}
        />
    );
}
```

## 📊 Performance

- **Renderização:** Otimizada com `map()` eficiente
- **Filtro:** O(n) onde n = número de options
- **Memory:** Sem vazamentos; listeners removidos ao desmontar

Para listas com **> 1000 items**, considere:
- Usar virtualização (como `react-window`)
- Paginação na API
- Lazy load de opções

## 🎯 Casos de Uso Ideais

✅ Multiselect de consumíveis
✅ Atribuição de múltiplos utilizadores
✅ Seleção de tags/categorias
✅ Filtros com múltiplas opções
✅ Formulários complexos com muitos campos

❌ Não usar para: Árvores hierárquicas (usar componente tree)
❌ Não usar para: Pares chave-valor (usar componente diferente)

## 📝 Notas

- Compatível com Laravel/Inertia
- Usa Tailwind CSS (certificar que está disponível)
- Testado em Chrome, Firefox, Safari, Edge
- Mobile-friendly com touch support

---

**Criado em:** 11 de Abril 2026  
**Localização:** `/resources/js/components/SearchableMultiSelect.tsx`  
**Dependências:** React 18+, Tailwind CSS
