import json
import os
import re

files = [
    "./questionnaire-app/backend/questionnaire.json",
    "./questionnaire-app/public/locales/gujarati/questionnaire.json",
    "./questionnaire-app/public/locales/punjabi/questionnaire.json",
    "./questionnaire-app/public/locales/malayalam/questionnaire.json",
    "./questionnaire-app/public/locales/hindi/questionnaire.json",
    "./questionnaire-app/public/locales/telugu/questionnaire.json",
    "./questionnaire-app/public/locales/english/questionnaire.json",
    "./questionnaire-app/public/locales/kannada/questionnaire.json",
    "./questionnaire-app/public/locales/tamil/questionnaire.json",
    "./questionnaire-app/public/locales/odia/questionnaire.json",
    "./questionnaire-app/public/locales/marathi/questionnaire.json",
    "./questionnaire-app/public/locales/bengali/questionnaire.json",
    "./questionnaire-app/src/assets/questionnaire_hindi.json",
    "./questionnaire-app/src/assets/questionnaire_m.json",
    "./questionnaire-app/src/assets/questionnaire _onlyq.json",
    "./questionnaire-app/src/assets/questionnaire.json"
]

def remove_from_sections(sections):
    for section in sections:
        if "questions" in section:
            new_questions = []
            for q in section["questions"]:
                if q.get("key") in ["Q39", "Q41"]:
                    continue
                
                # Check subQuestions
                if "subQuestions" in q:
                    new_sub = [sq for sq in q["subQuestions"] if sq.get("key") not in ["Q39", "Q41"]]
                    if not new_sub:
                        # If no subquestions left, remove subQuestions key AND condition if it was just for them
                        del q["subQuestions"]
                        # We keep the question itself, but we might want to remove the condition 
                        # if it was self-referencing to show subquestions.
                        # However, let's see if condition is needed for something else.
                        if q.get("condition") and q["condition"].get("key") == q["key"]:
                             del q["condition"]
                             # If we remove condition, maybe it becomes required?
                             # In backend/questionnaire.json, Q38 didn't have required: true but Q40 did.
                             # Actually Q38 should probably be required if it's a main question.
                             q["required"] = True
                    else:
                        q["subQuestions"] = new_sub
                
                new_questions.append(q)
            section["questions"] = new_questions

def process_file(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return

    # Some files might have comments or trailing commas if they are not strictly JSON
    # but let's assume they are valid JSON for now.
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = re.sub(r'//.*', '', content)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    try:
        data = json.loads(content, strict=False)
    except json.JSONDecodeError as e:
        # Try to clean up some common issues if needed, but let's hope it's fine.
        print(f"Error decoding JSON in {filepath}: {e}")
        return

    # 1. Remove from "sections" if it exists
    if "sections" in data:
        remove_from_sections(data["sections"])
    
    # 2. Remove from "questions" object if it exists
    if "questions" in data and isinstance(data["questions"], dict):
        if "Q39" in data["questions"]:
            del data["questions"]["Q39"]
        if "Q41" in data["questions"]:
            del data["questions"]["Q41"]

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Processed {filepath}")

for f in files:
    process_file(f)
