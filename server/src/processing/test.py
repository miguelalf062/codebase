import sys, json

payload = json.loads(sys.stdin.read())


# process 
outputPayload = payload


print(json.dumps(outputPayload))