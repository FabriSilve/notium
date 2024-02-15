# This code need to be hosted on an AWS Lambda function
import os
import json
import http.client

NOTION_API_KEY = os.environ.get("NOTION_KEY")
DATABASE_ID = os.environ.get("NOTION_DB")


def lambda_handler(event, context):
    raw_path = event.get("rawPath", '')
    if raw_path == "/favicon.ico":
        print(f"ignored path: {raw_path}")
        return {
            "statusCode": 404,
            "body": {}
        }

    query_params = event.get("queryStringParameters", {})

    pages = get_notion_pages(query_params)

    return {
        "statusCode": 200,
        "body": {
            "pages": pages
        }
    }


def get_notion_pages(query):
    headers = {
        "Authorization": f"Bearer {NOTION_API_KEY}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
    }

    cursor = query.get("cursor", None)
    page_size = int(query.get("page_size", 1))
    last_edited_time = query.get("last_edited_time", "2024-01-01")

    query_params = {
        "page_size": page_size,
        "filter": {
            "timestamp": "last_edited_time",
            "last_edited_time": {
                "after": last_edited_time
            }
        }
    }

    if cursor is not None:
        print("i am here")
        query_params["start_cursor"] = cursor

    url = f"/v1/databases/{DATABASE_ID}/query"
    conn = http.client.HTTPSConnection("api.notion.com")

    try:
        conn.request(
          "POST",
          url,
          body=json.dumps(query_params),
          headers=headers)
        response = conn.getresponse()

        if response.status == 200:
            data = json.loads(response.read().decode("utf-8"))
            return data
        else:
            error = f"Error: {response.status} - {response.read().decode('utf-8')}"
            print(error)
            return [{"NotionError": error}]
    except Exception as e:
        print(f"Exception occurred: {e}")
        return [{"Exception": f"Exception occurred: {e}"}]
    finally:
        conn.close()
