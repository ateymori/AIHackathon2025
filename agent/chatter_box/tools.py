import json
import os


def store_user(user_id: str, user_name: str, users_file_path: str | None = None) -> None:
    """Store a user's id and name in a JSON file.

    If the file does not exist or is empty, it will be created/initialized.
    The file format will be an array of objects like:
    [{"user_id": "...", "user_name": "..."}, ...]

    Args:
        user_id: The unique identifier for the user.
        user_name: The human-readable name for the user.
        users_file_path: Optional path to the JSON file. Defaults to
            a `users.json` file located beside this module.
    """

    if users_file_path is None:
        users_file_path = os.path.join(os.path.dirname(__file__), "users.json")

    # Ensure directory exists
    os.makedirs(os.path.dirname(users_file_path), exist_ok=True)

    # Load existing data if present and valid; otherwise start with an empty list
    users_data: list[dict[str, str]] = []
    if os.path.exists(users_file_path):
        try:
            with open(users_file_path, "r", encoding="utf-8") as read_handle:
                raw_content = read_handle.read().strip()
                if raw_content:
                    loaded = json.loads(raw_content)
                    if isinstance(loaded, list):
                        users_data = loaded
                    elif isinstance(loaded, dict):
                        # Gracefully handle legacy dict format by converting to list
                        users_data = [loaded]
        except json.JSONDecodeError:
            # If the file is corrupted or not valid JSON, reset to an empty list
            users_data = []

    # Append the new user entry
    users_data.append({"user_id": str(user_id), "user_name": str(user_name)})

    # Persist back to disk with pretty formatting
    with open(users_file_path, "w", encoding="utf-8") as write_handle:
        json.dump(users_data, write_handle, ensure_ascii=False, indent=2)


def get_userids(users_file_path: str | None = None) -> dict[str, str]:
    """Load users and return a mapping of user_name -> user_id.

    Handles non-existent, empty, or invalid files gracefully by returning an empty dict.

    Args:
        users_file_path: Optional path to the JSON file. Defaults to
            a `users.json` file located beside this module.

    Returns:
        A dictionary mapping user names to user IDs.
    """

    if users_file_path is None:
        users_file_path = os.path.join(os.path.dirname(__file__), "users.json")

    if not os.path.exists(users_file_path):
        return {}

    try:
        with open(users_file_path, "r", encoding="utf-8") as read_handle:
            raw_content = read_handle.read().strip()
            if not raw_content:
                return {}
            loaded = json.loads(raw_content)
            # Support either list of objects or a single dict (legacy)
            if isinstance(loaded, dict):
                loaded = [loaded]
            if not isinstance(loaded, list):
                return {}

            name_to_id: dict[str, str] = {}
            for entry in loaded:
                if isinstance(entry, dict):
                    user_name = entry.get("user_name")
                    user_id = entry.get("user_id")
                    if user_name is not None and user_id is not None:
                        name_to_id[str(user_name)] = str(user_id)
            return name_to_id
    except json.JSONDecodeError:
        return {}


if __name__ == "__main__":
    store_user("12345", "John Doe")
    store_user("23456", "Jonny Doe")
    store_user("3231", "Jo Doe")
    print(get_userids())
