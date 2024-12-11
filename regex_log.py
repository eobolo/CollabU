#!/usr/bin/env python3

import sys
import re

if len(sys.argv) == 3:
    if sys.argv[2] == "ipaddress":
        try:
            with open(sys.argv[1], 'r') as file:
                file_contents = file.read()
            ipaddresses = re.findall(r'(?P<ipaddresses>^\d\S+)', file_contents, re.MULTILINE)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(ipaddresses))
            elif response.lower() == "view":
                print('\n'.join(ipaddresses))
            else:
                print('\n'.join(ipaddresses))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif sys.argv[2] == "timestamp":
        try:
            with open(sys.argv[1], 'r') as file:
                file_contents = file.read()
            timestamps = re.findall(r'(?P<timestamp>.{26})(?<=\d)\]', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(timestamps))
            elif response.lower() == "view":
                print('\n'.join(timestamps))
            else:
                print('\n'.join(timestamps))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif sys.argv[2] == "httpmethod":
        try:
            with open(sys.argv[1], 'r') as file:
                file_contents = file.read()
            httpmethods = re.findall(r'"(?=\w)(?P<httpmethod>\w+.*?\w)"', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(httpmethods))
            elif response.lower() == "view":
                print('\n'.join(httpmethods))
            else:
                print('\n'.join(httpmethods))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif sys.argv[2] == "statuscode":
        try:
            with open(sys.argv[1], 'r') as file:
                file_contents = file.read()
            statuscodes = re.findall(r'(?<=".\s)(?P<statuscode>\d+)', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(statuscodes))
            elif response.lower() == "view":
                print('\n'.join(statuscodes))
            else:
                print('\n'.join(statuscodes))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif sys.argv[2] == "responsesize":
        try:
            with open(sys.argv[1], 'r') as file:
                file_contents = file.read()
            response_sizes = re.findall(r'(?P<response_size>\d+$)', file_contents, re.MULTILINE)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(response_sizes))
            elif response.lower() == "view":
                print('\n'.join(response_sizes))
            else:
                print('\n'.join(response_sizes))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    else:
        print(f"Log Data '{sys.argv[2]}' doesn't exist!!!")
else:
    file_name = input("Enter file name: ").strip()
    print("Which type of information would you like to extract?")
    print("ipaddress\ntimestamp\nhttpmethod\nstatuscode\nresponsesize")
    log_data = input("Enter one of the options above: ").strip()
    if log_data == "ipaddress":
        try:
            with open(file_name, 'r') as file:
                file_contents = file.read()
            ipaddresses = re.findall(r'(?P<ipaddresses>^\d\S+)', file_contents, re.MULTILINE)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(ipaddresses))
            elif response.lower() == "view":
                print('\n'.join(ipaddresses))
            else:
                print('\n'.join(ipaddresses))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif log_data == "timestamp":
        try:
            with open(file_name, 'r') as file:
                file_contents = file.read()
            timestamps = re.findall(r'(?P<timestamp>.{26})(?<=\d)\]', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(timestamps))
            elif response.lower() == "view":
                print('\n'.join(timestamps))
            else:
                print('\n'.join(timestamps))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif log_data == "httpmethod":
        try:
            with open(file_name, 'r') as file:
                file_contents = file.read()
            httpmethods = re.findall(r'"(?=\w)(?P<httpmethod>\w+.*?\w)"', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(httpmethods))
            elif response.lower() == "view":
                print('\n'.join(httpmethods))
            else:
                print('\n'.join(httpmethods))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif log_data == "statuscode":
        try:
            with open(file_name, 'r') as file:
                file_contents = file.read()
            statuscodes = re.findall(r'(?<=".\s)(?P<statuscode>\d+)', file_contents)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(statuscodes))
            elif response.lower() == "view":
                print('\n'.join(statuscodes))
            else:
                print('\n'.join(statuscodes))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    elif log_data == "responsesize":
        try:
            with open(file_name, 'r') as file:
                file_contents = file.read()
            response_sizes = re.findall(r'(?P<response_size>\d+$)', file_contents, re.MULTILINE)
            response = input("Do you want to view or save? ").strip()
            if response.lower() == "save":
                filename = input("Enter a file name: ").strip()
                with open(filename, 'w') as outfile:
                    outfile.write('\n'.join(response_sizes))
            elif response.lower() == "view":
                print('\n'.join(response_sizes))
            else:
                print('\n'.join(response_sizes))
        except FileNotFoundError as e:
            print(f"An error occurred: {e}")
        except PermissionError as e:
            print(f"An error occurred: {e}")
        except Exception as e:
            print(f"An error occurred: {e}")
    else:
        print(f"Log Data '{log_data}' doesn't exist!!!")