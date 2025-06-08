# Personal TODO Service: Priority and Task Type Feature Specification

---

## 1. Feature Definition & Purpose

### 1.1 Priority
- Assign a priority (e.g., importance/urgency) to each todo, helping users focus on what matters most.
- Purpose: Efficient time management and handling urgent tasks first.

### 1.2 Task Type
- Assign a category to each todo (e.g., work, personal, shopping, study, etc.).
- Purpose: Easier management through classification and future statistics.

---

## 2. Detailed Requirements

### 2.1 Priority
- Allow users to set priority when creating a todo (e.g., high/medium/low or 1~5 levels).
- Support sorting/filtering by priority.
- Default: "medium" or 3.

### 2.2 Task Type
- Allow users to select a type when creating a todo (predefined list + user-defined types).
- Support filtering/statistics by type.
- Default: "General".

### 2.3 Others
- Existing todos can be updated to add priority/type (edit feature).
- API, DB, and UI must all be extended to support these features.

---

## 3. Data Structure Design

### 3.1 Todo Data Model (TypeScript Example)
```ts
interface Todo {
  id: number;
  text: string;
  priority: 'low' | 'medium' | 'high'; // or number (1~5)
  type: string; // e.g., 'work', 'personal', 'shopping', ...
}
```

### 3.2 DB Table Example (SQLite)
```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high'
  type TEXT NOT NULL DEFAULT 'General'
);
```

---

## 4. UI/UX Flow

### 4.1 Add/Edit Todo Screen
- Text input
- Priority selection (dropdown/radio: High, Medium, Low)
- Type selection (dropdown/tag: Work, Personal, Shopping, Study, Other)
- Save button

### 4.2 Todo List Screen
- Sorting and filtering by priority/type
- Display priority/type for each todo

---

## 5. Example Scenarios

1. Add a todo "Prepare for meeting" with priority "High" and type "Work".
2. Add a todo "Grocery shopping" with priority "Medium" and type "Shopping".
3. Filter the list to show only "High" priority todos to focus on urgent tasks.

---

## 6. Scalability & Additional Considerations

- Type management: Allow users to add/delete custom types (future feature)
- Priority: Can be extended to numeric levels (1~5)
- Statistics: Provide completion rates and counts by type/priority (future feature)
- API/DB migration: Apply default values to existing data
- Mobile/Web UI: Same structure can be extended

---

## 7. Reference
- This document is based on the existing project code (`src/database.ts`, `src/index.ts`), `README.md`, and common UX patterns for todo services. 