from app.celery import app
def start_celery_worker():

    # Start worker
    worker = app.Worker(loglevel='info')
    worker.start()

if __name__ == '__main__':
    start_celery_worker()
