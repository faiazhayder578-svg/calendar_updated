import json

# Read the JSON file
with open('extracted_events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

print("\n" + "="*80)
print(f"EXTRACTED EVENTS FROM PDF - Total: {len(events)}")
print("="*80 + "\n")

for i, event in enumerate(events, 1):
    print(f"{i}. {event['date']} ({event['dayOfWeek']})")
    print(f"   Title: {event['title']}")
    print(f"   Type: {event['type']}")
    print()

print("="*80)
print(f"\nFull JSON Output:\n")
print(json.dumps(events, indent=2, ensure_ascii=False))
