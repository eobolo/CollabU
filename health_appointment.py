import json
import os
from datetime import datetime, timedelta

# Appointment Class
class Appointment:
    def __init__(self, appointment_id, patient_name, doctor_name, appointment_time, status="scheduled"):
        self.appointment_id = appointment_id
        self.patient_name = patient_name
        self.doctor_name = doctor_name
        self.appointment_time = appointment_time
        self.status = status

    def to_dict(self):
        return {
            "appointment_id": self.appointment_id,
            "patient_name": self.patient_name,
            "doctor_name": self.doctor_name,
            "appointment_time": self.appointment_time,
            "status": self.status
        }

# Utility Functions for File Management
FILE_NAME = 'appointments.json'

DOCTORS = ["Akani", "Abiodun", "Excel", "Merveille", "Emmanuel", "Faith"]

def get_latest_appointment(appointments, doctor_name):
    """
    Get the latest appointment time for a specific doctor.
    """
    doctor_appointments = [
        datetime.strptime(appt.appointment_time, "%Y-%m-%d %H:%M")
        for appt in appointments
        if appt.doctor_name.lower() == doctor_name.lower() and appt.status == "scheduled"
    ]
    return max(doctor_appointments) if doctor_appointments else None

def load_appointments():
    if os.path.exists(FILE_NAME) and os.path.getsize(FILE_NAME) > 0:
        try:
            with open(FILE_NAME, 'r') as file:
                data = json.load(file)
                return [Appointment(**appt) for appt in data]
        except json.JSONDecodeError:
            print("Error: Appointment file is corrupted. Starting fresh.")
            return []
    return []

def save_appointments(appointments):
    with open(FILE_NAME, 'w') as file:
        json.dump([appt.to_dict() for appt in appointments], file, indent=4)

def is_time_conflict(latest_time, new_time):
    """
    Check if the new appointment time conflicts within 45 minutes of the latest one.
    """
    if not latest_time:
        return False  # No previous appointment
    time_difference = abs((new_time - latest_time).total_seconds())
    return time_difference < 45 * 60  # 45 minutes buffer

# View Appointments
def view_appointments(appointments, doctor_name=None):
    if not appointments:
        print("\nNo appointments available.\n")
        return

    filtered_appts = [appt for appt in appointments if (doctor_name is None or appt.doctor_name == doctor_name)]
    filtered_appts.sort(key=lambda x: datetime.strptime(x.appointment_time, "%Y-%m-%d %H:%M"))

    print("\n--- Appointments Schedule ---")
    for appt in filtered_appts:
        print(f"ID: {appt.appointment_id}, Patient: {appt.patient_name}, Doctor: {appt.doctor_name}, "
              f"Time: {appt.appointment_time}, Status: {appt.status}")
    print()

def schedule_appointment(appointments):
    print("Available Doctors:", ", ".join(DOCTORS))
    doctor_name = input("Enter Doctor Name: ").title()

    if doctor_name not in DOCTORS:
        print("Error: Invalid doctor name. Please choose from the available doctors.\n")
        return

    appointment_id = input("Enter Appointment ID: ")
    if any(appt.appointment_id == appointment_id for appt in appointments):
        print("Error: Appointment ID already exists.\n")
        return

    patient_name = input("Enter Patient Name: ")
    appointment_time = input("Enter Appointment Time (YYYY-MM-DD HH:MM): ")

    try:
        new_time = datetime.strptime(appointment_time, "%Y-%m-%d %H:%M")
    except ValueError:
        print("Error: Invalid time format. Use YYYY-MM-DD HH:MM.\n")
        return

    # Check for the latest appointment for the doctor
    latest_time = get_latest_appointment(appointments, doctor_name)
    if latest_time:
        print(f"The latest appointment for Dr. {doctor_name} is at {latest_time.strftime('%Y-%m-%d %H:%M')}.")

    # Check for time conflicts
    if is_time_conflict(latest_time, new_time):
        print("Error: This appointment falls within 45 minutes of the latest one.")
        override = input("Do you want to override and schedule anyway? (yes/no): ").lower()
        if override != "yes":
            print("Appointment was not scheduled.\n")
            return
        print("Override confirmed. Scheduling appointment...\n")

    # Schedule the appointment
    new_appointment = Appointment(appointment_id, patient_name, doctor_name, appointment_time)
    appointments.append(new_appointment)
    save_appointments(appointments)
    print(f"Appointment {appointment_id} with Dr. {doctor_name} scheduled successfully.\n")

# Check-in Appointment
def check_in_appointment(appointments):
    view_appointments(appointments)
    appointment_id = input("Enter Appointment ID to check-in: ")

    for appt in appointments:
        if appt.appointment_id == appointment_id and appt.status == "scheduled":
            appt.status = "completed"
            save_appointments(appointments)
            print(f"Appointment {appointment_id} has been marked as completed.\n")
            return

    print("Sorry: Appointment ID not found, cancelled or already completed.\n")

# Cancel Appointment
def cancel_appointment(appointments):
    view_appointments(appointments)
    appointment_id = input("Enter Appointment ID to cancel: ")

    for appt in appointments:
        if appt.appointment_id == appointment_id and appt.status == "scheduled":
            appt.status = "canceled"
            save_appointments(appointments)
            print(f"Appointment {appointment_id} has been canceled.\n")
            return

    print("Sorry: Appointment ID not found, completed or already canceled.\n")

# Main Menu
def main():
    appointments = load_appointments()
    print("Welcome to the Health Clinic Appointment Scheduling System!")

    while True:
        print("1. Schedule a new appointment")
        print("2. View appointments")
        print("3. Check-in an appointment")
        print("4. Cancel an appointment")
        print("5. Exit")
        choice = input("Enter your choice: ")

        if choice == '1':
            schedule_appointment(appointments)
        elif choice == '2':
            doctor_name = input("Enter Doctor's Name to filter (leave blank for all): ").strip()
            view_appointments(appointments, doctor_name if doctor_name else None)
        elif choice == '3':
            check_in_appointment(appointments)
        elif choice == '4':
            cancel_appointment(appointments)
        elif choice == '5':
            print("Exiting... Goodbye!")
            break
        else:
            print("Invalid choice. Please try again.\n")

if __name__ == "__main__":
    main()
