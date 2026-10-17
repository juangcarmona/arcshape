def process_order(order_id, repository):
    repository.mark_processing(order_id)
    repository.mark_fulfilled(order_id)
