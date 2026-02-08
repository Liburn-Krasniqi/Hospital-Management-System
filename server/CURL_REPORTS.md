# Reports API – cURL Test Commands

**Base URL:** `http://localhost:8080/api/reports`

Replace `PATIENT_ID`, `DOCTOR_ID`, and `APPOINTMENT_ID` with real IDs from your DB. To get them:

```bash
# Get a patient ID
curl -s http://localhost:8080/api/patients/5-0 | jq '.[0][0].id'

# Get a doctor ID
curl -s http://localhost:8080/api/doctors/5-0 | jq '.[0][0].id'

# Get an appointment ID (by doctor)
curl -s http://localhost:8080/api/appointments/id/DOCTOR_ID | jq '.[0].id'
```

---

## CREATE

```bash
# Create report (no appointment)
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID",
    "doctorId": "DOCTOR_ID",
    "findings": "Patient presents with mild fever and sore throat.",
    "recommendations": "Rest, fluids, over-the-counter pain relief. Follow up if symptoms persist."
  }'

# Create report (linked to appointment)
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID",
    "doctorId": "DOCTOR_ID",
    "appointmentId": "APPOINTMENT_ID",
    "findings": "Blood pressure elevated at 145/92.",
    "recommendations": "Monitor BP, reduce salt intake, recheck in 2 weeks.",
    "typeOfVisit": "CONSULTATION"
  }'

# Create with custom reportDate and typeOfVisit
curl -X POST http://localhost:8080/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "PATIENT_ID",
    "doctorId": "DOCTOR_ID",
    "findings": "Surgery completed successfully.",
    "recommendations": "Post-operative care instructions provided.",
    "typeOfVisit": "SURGERY",
    "reportDate": "2025-02-08T10:00:00.000Z"
  }'
```

`typeOfVisit` values: `CONSULTATION`, `SURGERY`, `TEST`, `OTHER`

---

## READ

```bash
# Get all reports (paginated, take=5 skip=0)
curl http://localhost:8080/api/reports/5-0

# Get report by ID
curl http://localhost:8080/api/reports/id/REPORT_ID

# Get reports by patient ID
curl http://localhost:8080/api/reports/patient/PATIENT_ID

# Get reports by doctor ID
curl http://localhost:8080/api/reports/doctor/DOCTOR_ID

# Get reports by appointment ID
curl http://localhost:8080/api/reports/appointment/APPOINTMENT_ID
```

---

## UPDATE

```bash
curl -X PUT http://localhost:8080/api/reports/id/REPORT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "findings": "Updated findings after follow-up.",
    "recommendations": "Extended rest period recommended."
  }'

# Update with appointment link
curl -X PUT http://localhost:8080/api/reports/id/REPORT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "appointmentId": "APPOINTMENT_ID"
  }'

# Update typeOfVisit
curl -X PUT http://localhost:8080/api/reports/id/REPORT_ID \
  -H "Content-Type: application/json" \
  -d '{"typeOfVisit": "TEST"}'
```

---

## DELETE

```bash
curl -X DELETE http://localhost:8080/api/reports/id/REPORT_ID
```
