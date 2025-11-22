# test_hash.py
from utils.hash import hash_password, verify_password
print("Testing Argon2 hashing...")
pw = "1234"
h = hash_password(pw)
print("hash length:", len(h))
print("verify:", verify_password(pw, h))
