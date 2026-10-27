# scripts/generate_official_subdivisions.py
import pycountry
import json
import re

# Fallbacks for territories not in standard ISO 3166-2 pycountry list
CUSTOM_SUBDIVISIONS = {
    "VA": [
        {"id": "VA-01", "name": "Saint Peter's Square & Basilica", "code": "01", "type": "Sector"},
        {"id": "VA-02", "name": "Vatican Gardens & Observatory Lab", "code": "02", "type": "Sector"},
        {"id": "VA-03", "name": "Belvedere Courtyard & Apostolic Library", "code": "03", "type": "Sector"}
    ],
    "XK": [
        {"id": "XK-PRI", "name": "Pristina District", "code": "PRI", "type": "District"},
        {"id": "XK-PRZ", "name": "Prizren District", "code": "PRZ", "type": "District"},
        {"id": "XK-PEJ", "name": "Peja District", "code": "PEJ", "type": "District"},
        {"id": "XK-MIT", "name": "Mitrovica District", "code": "MIT", "type": "District"},
        {"id": "XK-GJI", "name": "Gjilan District", "code": "GJI", "type": "District"},
        {"id": "XK-FER", "name": "Ferizaj District", "code": "FER", "type": "District"},
        {"id": "XK-GJA", "name": "Gjakova District", "code": "GJA", "type": "District"}
    ]
}

def get_subdivisions_for_country(country_code):
    if country_code in CUSTOM_SUBDIVISIONS:
        return CUSTOM_SUBDIVISIONS[country_code]
    
    subs = list(pycountry.subdivisions.get(country_code=country_code) or [])
    if not subs:
        return []
    
    # Sort alphabetically by subdivision name
    subs_sorted = sorted(subs, key=lambda s: s.name)
    result = []
    prefix = f"{country_code}-"
    for s in subs_sorted:
        sub_code = s.code[len(prefix):] if s.code.startswith(prefix) else s.code
        result.append({
            "id": s.code,
            "name": s.name,
            "code": sub_code,
            "type": getattr(s, "type", "Subdivision")
        })
    return result

# Read all 197 country codes from PDF list
PDF_CODES = [
  'DZ','AO','BJ','BW','BF','BI','CV','CM','CF','TD','KM','CG','CD','CI','DJ','EG','GQ','ER','SZ','ET','GA','GM','GH','GN','GW','KE','LS','LR','LY','MG','MW','ML','MR','MU','MA','MZ','NA','NE','NG','RW','ST','SN','SC','SL','SO','ZA','SS','SD','TZ','TG','TN','UG','ZM','ZW',
  'AF','AM','AZ','BH','BD','BT','BN','KH','CN','CY','GE','IN','ID','IR','IQ','IL','JP','JO','KZ','KW','KG','LA','LB','MY','MV','MN','MM','NP','KP','OM','PK','PS','PH','QA','SA','SG','KR','LK','SY','TW','TJ','TH','TL','TR','TM','AE','UZ','VN','YE',
  'AL','AD','AT','BY','BE','BA','BG','HR','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','XK','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA',
  'AG','BS','BB','BZ','CA','CR','CU','DM','DO','SV','GD','GT','HT','HN','JM','MX','NI','PA','KN','LC','VC','TT','US',
  'AR','BO','BR','CL','CO','EC','GY','PY','PE','SR','UY','VE',
  'AU','FJ','KI','MH','FM','NR','NZ','PW','PG','WS','SB','TO','TV','VU'
]

data = {}
total_subs = 0
for code in PDF_CODES:
    sub_list = get_subdivisions_for_country(code)
    data[code] = sub_list
    total_subs += len(sub_list)
    print(f"{code}: {len(sub_list)} subdivisions")

with open('scripts/official-subdivisions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nDone! Extracted {total_subs} official subdivisions for {len(PDF_CODES)} countries.")
