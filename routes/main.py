from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain_openai import ChatOpenAI
import os
import sys
from dotenv import load_dotenv,find_dotenv
# from langchain_community.llms import OpenAI
load_dotenv(find_dotenv())

username = "postgres" 
password = "password" 
host = "localhost" 
port = 5432
mydatabase = "inoble"

pg_uri = f"postgresql+psycopg2://{username}:{password}@{host}:{port}/{mydatabase}"
db = SQLDatabase.from_uri(pg_uri)

OpenAI_key = os.environ.get("OPENAI_API_KEY")

llm = ChatOpenAI(temperature=0, openai_api_key=OpenAI_key, model_name='gpt-3.5-turbo')

PROMPT = """ 
Given an input question, first create a syntactically correct postgresql query to run,  
then look at the results of the query and return the answer.  
The question: {question}
"""

db_chain = SQLDatabaseChain.from_llm(llm, db=db, top_k=10)

question = sys.argv[1]

result = db_chain.invoke(PROMPT.format(question=question))

print(result['result'])
sys.stdout.flush()