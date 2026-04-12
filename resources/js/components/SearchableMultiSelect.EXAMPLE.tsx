/**
 * EXEMPLO DE INTEGRAÇÃO - SearchableMultiSelect
 * 
 * Este ficheiro mostra como usar o componente SearchableMultiSelect
 * no formulário Surgery para os campos B1-B4
 * 
 * PASSO 1: Importar o componente no topo do ficheiro form.tsx
 */

import SearchableMultiSelect from '@/components/SearchableMultiSelect';

/**
 * PASSO 2: No Step 5 (Robótico), substituir os checkboxes de B1-B4 por:
 */

// ============= ANTES (Checkboxes) =============
// {consumivel_tipos.map((pinça) => (
//     <div key={pinça.id} className="flex items-center gap-2">
//         <input
//             type="checkbox"
//             id={`b1_${pinça.id}`}
//             checked={(data.b1 as number[])?.includes(pinça.id) ?? false}
//             onChange={(e) => {
//                 const currentB1 = (data.b1 as number[]) ?? [];
//                 if (e.target.checked) {
//                     setData('b1', [...currentB1, pinça.id]);
//                 } else {
//                     setData('b1', currentB1.filter(id => id !== pinça.id));
//                 }
//             }}
//         />
//         <label htmlFor={`b1_${pinça.id}`}>{pinça.nome}</label>
//     </div>
// ))}

// ============= DEPOIS (SearchableMultiSelect) =============
// <SearchableMultiSelect
//     options={consumivel_tipos}
//     selectedIds={(data.b1 as number[]) ?? []}
//     onSelectionChange={(selectedIds) => setData('b1', selectedIds)}
//     placeholder="Procurar pinças B1..."
// />

/**
 * PASSO 3: Repetir para B2, B3 e B4 da mesma forma:
 */

// Para B2:
// <SearchableMultiSelect
//     options={consumivel_tipos}
//     selectedIds={(data.b2 as number[]) ?? []}
//     onSelectionChange={(selectedIds) => setData('b2', selectedIds)}
//     placeholder="Procurar pinças B2..."
// />

// Para B3:
// <SearchableMultiSelect
//     options={consumivel_tipos}
//     selectedIds={(data.b3 as number[]) ?? []}
//     onSelectionChange={(selectedIds) => setData('b3', selectedIds)}
//     placeholder="Procurar pinças B3..."
// />

// Para B4:
// <SearchableMultiSelect
//     options={consumivel_tipos}
//     selectedIds={(data.b4 as number[]) ?? []}
//     onSelectionChange={(selectedIds) => setData('b4', selectedIds)}
//     placeholder="Procurar pinças B4..."
// />

/**
 * ============================================================
 * EXEMPLO COMPLETO - Step 5 (Robótico) com SearchableMultiSelect
 * ============================================================
 */

export function Step5RoboticoExample() {
    return (
        <div className="space-y-8">
            {/* Monopolar Coag - Card Azul */}
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded">
                <h3 className="font-bold text-blue-900 mb-4">Monopolar Coagulação</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Potência (watts)"
                        value={data.monopolar_coag_watts ?? ''}
                        onChange={(e) => setData('monopolar_coag_watts', e.target.value ? Number(e.target.value) : null)}
                        className="px-3 py-2 border rounded"
                    />
                    <select
                        value={data.monopolar_coag_tipo ?? ''}
                        onChange={(e) => setData('monopolar_coag_tipo', e.target.value || null)}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="">Selecionar tipo</option>
                        <option value="pure">Pure</option>
                        <option value="flugurate">Flugurate</option>
                        <option value="soft">Soft</option>
                    </select>
                </div>
            </div>

            {/* Monopolar Cut - Card Verde */}
            <div className="p-4 border-l-4 border-green-500 bg-green-50 rounded">
                <h3 className="font-bold text-green-900 mb-4">Monopolar Corte</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Potência (watts)"
                        value={data.monopolar_cut_watts ?? ''}
                        onChange={(e) => setData('monopolar_cut_watts', e.target.value ? Number(e.target.value) : null)}
                        className="px-3 py-2 border rounded"
                    />
                    <select
                        value={data.monopolar_cut_tipo ?? ''}
                        onChange={(e) => setData('monopolar_cut_tipo', e.target.value || null)}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="">Selecionar tipo</option>
                        <option value="pure">Pure</option>
                        <option value="flugurate">Flugurate</option>
                        <option value="soft">Soft</option>
                    </select>
                </div>
            </div>

            {/* Bipolar Coag - Card Laranja */}
            <div className="p-4 border-l-4 border-orange-500 bg-orange-50 rounded">
                <h3 className="font-bold text-orange-900 mb-4">Bipolar Coagulação</h3>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        placeholder="Potência (watts)"
                        value={data.bipolar_coag_watts ?? ''}
                        onChange={(e) => setData('bipolar_coag_watts', e.target.value ? Number(e.target.value) : null)}
                        className="px-3 py-2 border rounded"
                    />
                    <select
                        value={data.bipolar_coag_tipo ?? ''}
                        onChange={(e) => setData('bipolar_coag_tipo', e.target.value || null)}
                        className="px-3 py-2 border rounded"
                    >
                        <option value="">Selecionar tipo</option>
                        <option value="pure">Pure</option>
                        <option value="flugurate">Flugurate</option>
                        <option value="soft">Soft</option>
                    </select>
                </div>
            </div>

            {/* B1 - SearchableMultiSelect */}
            <div className="space-y-2">
                <label className="block font-semibold text-gray-700">B1 - Pinças</label>
                <SearchableMultiSelect
                    options={consumivel_tipos}
                    selectedIds={(data.b1 as number[]) ?? []}
                    onSelectionChange={(selectedIds) => setData('b1', selectedIds)}
                    placeholder="Procurar pinças B1..."
                />
            </div>

            {/* B2 - SearchableMultiSelect */}
            <div className="space-y-2">
                <label className="block font-semibold text-gray-700">B2 - Pinças</label>
                <SearchableMultiSelect
                    options={consumivel_tipos}
                    selectedIds={(data.b2 as number[]) ?? []}
                    onSelectionChange={(selectedIds) => setData('b2', selectedIds)}
                    placeholder="Procurar pinças B2..."
                />
            </div>

            {/* B3 - SearchableMultiSelect */}
            <div className="space-y-2">
                <label className="block font-semibold text-gray-700">B3 - Pinças</label>
                <SearchableMultiSelect
                    options={consumivel_tipos}
                    selectedIds={(data.b3 as number[]) ?? []}
                    onSelectionChange={(selectedIds) => setData('b3', selectedIds)}
                    placeholder="Procurar pinças B3..."
                />
            </div>

            {/* B4 - SearchableMultiSelect */}
            <div className="space-y-2">
                <label className="block font-semibold text-gray-700">B4 - Pinças</label>
                <SearchableMultiSelect
                    options={consumivel_tipos}
                    selectedIds={(data.b4 as number[]) ?? []}
                    onSelectionChange={(selectedIds) => setData('b4', selectedIds)}
                    placeholder="Procurar pinças B4..."
                />
            </div>
        </div>
    );
}
