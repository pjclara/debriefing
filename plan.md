# 🏥 MVP – App de Briefing Cirúrgico

## Stack: Laravel 12 + React (Starter Kit)

---

## 🎯 Objetivo

Criar uma aplicação web (MVP) para substituir um formulário Word de briefing cirúrgico, com backend em Laravel 12 e frontend em React (via starter kit oficial com Inertia ou API).

---

## 🧠 Papel do Assistente

Atua como um programador sénior full-stack.

Deves:

* Gerar código funcional e organizado
* Seguir boas práticas (Laravel + React)
* Criar estrutura escalável
* Explicar brevemente quando necessário

---

## ⚙️ Stack Técnica

* Backend: Laravel 12
* Frontend: React (starter kit Laravel)
* Base de dados: MySQL
* ORM: Eloquent
* API: REST (ou Inertia se preferires)

---

## 🧱 Funcionalidades do MVP

### 1. CRUD de Cirurgias

* Criar cirurgia
* Listar cirurgias
* Editar cirurgia
* Ver detalhes

---

## 🗄️ Modelo de Dados

Cria uma tabela `surgeries` com os seguintes campos:

```json id="model1"
{
  "id": "increments",
  "data": "date",
  "hora": "time",
  "especialidade": "string",
  "sala": "string",

  "equipa_segura": "boolean",
  "problemas_sala": "boolean",
  "descricao_problemas": "text nullable",
  "equipamento_ok": "boolean",

  "processo": "string",
  "procedimento": "string",
  "destino": "string",

  "consentimento": "boolean",
  "lateralidade": "string",
  "medicacao_suspensa": "boolean",
  "antibiotico": "string nullable",
  "profilaxia": "boolean",
  "perdas_estimadas": "integer nullable",
  "reserva_ativa": "boolean",
  "reserva_unidades": "integer nullable",

  "trocares": "integer nullable",
  "otica": "string",
  "monopolar_coag": "string nullable",
  "monopolar_cut": "string nullable",
  "bipolar_coag": "string nullable",

  "b1": "string nullable",
  "b2": "string nullable",
  "b3": "string nullable",
  "b4": "string nullable",
  "equipamento_extra": "text nullable",

  "complicacoes": "boolean",
  "descricao_complicacoes": "text nullable",
  "falha_sistema": "boolean",
  "inicio_a_horas": "boolean",
  "fim_a_horas": "boolean",
  "correu_bem": "text nullable",
  "melhorar": "text nullable",
  "falha_comunicacao": "text nullable",
  "evento_adverso": "boolean",
  "descricao_evento": "text nullable",

  "timestamps": true
}
```

---

## 🔧 Backend (Laravel)

### Criar:

* Migration
* Model: Surgery
* Controller: SurgeryController

### Rotas:

```php
Route::resource('surgeries', SurgeryController::class);
```

### Requisitos:

* Validação de dados (Form Request)
* Uso de Eloquent
* Respostas JSON ou Inertia

---

## 🎨 Frontend (React)

Criar páginas:

### 1. Lista (`/surgeries`)

* Tabela com:

  * Data
  * Procedimento
  * Sala
* Botão “Nova cirurgia”

---

### 2. Formulário (`/surgeries/create` e edit)

Organizar em secções:

#### 🟦 Dados iniciais

Inputs:

* data
* hora
* especialidade
* sala

---

#### 🟩 Checklist

Checkbox:

* equipa_segura
* problemas_sala
* equipamento_ok

Se `problemas_sala = true`:

* mostrar textarea

---

#### 🟨 Planeamento

* processo
* procedimento
* destino

Checkbox:

* consentimento
* medicacao_suspensa
* profilaxia

Select:

* lateralidade (N/A, Direito, Esquerdo)

Antibiótico:

* input condicional

---

#### 🟪 Robótico

* trocares
* otica (select: 0 / 30)

Inputs:

* monopolar_coag

* monopolar_cut

* bipolar_coag

* b1, b2, b3, b4

---

#### 🟥 Debriefing

Checkbox:

* complicacoes
* falha_sistema
* inicio_a_horas
* fim_a_horas
* evento_adverso

Textareas:

* descricao_complicacoes
* correu_bem
* melhorar

---

## 🎯 UX Requisitos

* Inputs grandes
* Layout em secções (cards)
* Scroll vertical
* Feedback visual simples

---

## 📦 Output Esperado

Gera:

1. Migration completa
2. Model
3. Controller
4. Rotas
5. Componentes React:

   * Index.jsx
   * Form.jsx
6. Integração frontend-backend

---

## ⚠️ Notas

* Não complicar com autenticação
* Código deve correr localmente
* Priorizar funcionalidade sobre perfeição

---

## 🚀 Pedido Final

Gera o código completo para este MVP com Laravel 12 + React starter kit.

Divide a resposta em blocos:

* Backend
* Frontend
* Instruções para correr

---
