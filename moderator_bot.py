import datetime
import sys

# Mocked Users Data Structure
users = {
    "1234": {"name": "User1", "permissions": []},
    "5678": {"name": "User2", "permissions": []},
    "9999": {"name": "Admin", "permissions": ["KICK_MEMBERS", "BAN_MEMBERS", "ADMIN"]},
}

# Role Management
roles = {
    "Admin": ["KICK_MEMBERS", "BAN_MEMBERS", "ADMIN"],
    "Moderator": ["KICK_MEMBERS"],
    "Member": []
}

# Server Members List
server_members = ["1234", "5678", "9999"]
muted_users = {}
banned_users = []
log_history = []
ADMIN_PASSWORD = "secure123"

# Logger: Logs actions to the console and history
def log_action(action, user_name, target_name=None, reason=None):
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_message = f"[{now}] ACTION: {user_name} performed '{action}'"
    if target_name:
        log_message += f" on {target_name}"
    if reason:
        log_message += f" (Reason: {reason})"
    print(log_message)
    log_history.append(log_message)

# Role-based Permission Check
def has_permission(user_id, permission):
    return permission in users[user_id].get("permissions", [])

# Command Functions
def ping_command():
    print("Pong! Latency: 123ms")

def kick_command(executor_id):
    if not has_permission(executor_id, "KICK_MEMBERS"):
        print("Error: You do not have permission to kick members.")
        return
    print("Available Members to Kick:")
    for member_id in server_members:
        if member_id != executor_id:  # Don't allow self-kick
            print(f"- {users[member_id]['name']} (ID: {member_id})")
    target_id = input("Enter User ID to kick: ").strip()
    if target_id not in server_members:
        print("Error: Invalid User ID.")
        return
    reason = input("Enter reason for kick: ").strip()
    server_members.remove(target_id)
    print(f"{users[target_id]['name']} has been kicked.")
    log_action("kick", users[executor_id]['name'], users[target_id]['name'], reason)

def ban_command(executor_id):
    if not has_permission(executor_id, "BAN_MEMBERS"):
        print("Error: You do not have permission to ban members.")
        return
    print("Available Members to Ban:")
    for member_id in server_members:
        if member_id != executor_id:  # Don't allow self-ban
            print(f"- {users[member_id]['name']} (ID: {member_id})")
    target_id = input("Enter User ID to ban: ").strip()
    if target_id not in server_members:
        print("Error: Invalid User ID.")
        return
    reason = input("Enter reason for ban: ").strip()
    server_members.remove(target_id)
    banned_users.append(target_id)
    print(f"{users[target_id]['name']} has been banned.")
    log_action("ban", users[executor_id]['name'], users[target_id]['name'], reason)

def unban_command(executor_id):
    if not has_permission(executor_id, "BAN_MEMBERS"):
        print("Error: You do not have permission to unban members.")
        return
    print("Banned Users:")
    for user_id in banned_users:
        print(f"- {users[user_id]['name']} (ID: {user_id})")
    target_id = input("Enter User ID to unban: ").strip()
    if target_id in banned_users:
        banned_users.remove(target_id)
        server_members.append(target_id)
        print(f"{users[target_id]['name']} has been unbanned.")
        log_action("unban", users[executor_id]['name'], users[target_id]['name'])
    else:
        print("Error: Invalid User ID or user not banned.")

def mute_command(executor_id):
    if not has_permission(executor_id, "KICK_MEMBERS"):
        print("Error: You do not have permission to mute members.")
        return
    target_id = input("Enter User ID to mute: ").strip()
    if target_id not in server_members:
        print("Error: Invalid User ID.")
        return
    duration = int(input("Enter duration (in minutes): ").strip())
    muted_users[target_id] = datetime.datetime.now() + datetime.timedelta(minutes=duration)
    print(f"{users[target_id]['name']} has been muted for {duration} minutes.")
    log_action("mute", users[executor_id]['name'], users[target_id]['name'], f"{duration} minutes")

def view_audit_log():
    print("\n===== Audit Log =====")
    for log in log_history:
        print(log)
    print("======================")

def help_command():
    print("\n===== Help Menu =====")
    print("1. Ping - Check the bot's latency.")
    print("2. Kick User - Remove a user from the server.")
    print("3. Ban User - Permanently ban a user from the server.")
    print("4. Unban User - Restore a previously banned user.")
    print("5. Mute User - Temporarily mute a user.")
    print("6. View Server Members - List all current server members.")
    print("7. View Audit Log - Show all actions taken in the bot.")
    print("8. Help - Display this help menu.")
    print("9. Exit - Quit the bot.")
    print("=====================")

# Main Menu
def display_menu():
    print("\n===== Console Bot Menu =====")
    print("1. Ping")
    print("2. Kick User")
    print("3. Ban User")
    print("4. Unban User")
    print("5. Mute User")
    print("6. View Server Members")
    print("7. View Audit Log")
    print("8. Help")
    print("9. Exit")
    print("===========================")

def view_members():
    print("\nCurrent Server Members:")
    for member_id in server_members:
        if member_id not in muted_users or datetime.datetime.now() > muted_users[member_id]:
            print(f"- {users[member_id]['name']} (ID: {member_id})")
        else:
            print(f"- {users[member_id]['name']} (ID: {member_id}) [MUTED]")

def main():
    executor_id = "9999"  # Set Admin User as executor for simplicity
    print(f"Welcome, {users[executor_id]['name']}! You are logged in as Admin.")
    while True:
        display_menu()
        choice = input("Select an option (1-9): ").strip()

        if choice == "1":
            ping_command()
        elif choice == "2":
            kick_command(executor_id)
        elif choice == "3":
            ban_command(executor_id)
        elif choice == "4":
            unban_command(executor_id)
        elif choice == "5":
            mute_command(executor_id)
        elif choice == "6":
            view_members()
        elif choice == "7":
            view_audit_log()
        elif choice == "8":
            help_command()
        elif choice == "9":
            print("Exiting the Console Bot. Goodbye!")
            sys.exit(0)
        else:
            print("Invalid option. Please select 1-9.")

if __name__ == "__main__":
    main()
