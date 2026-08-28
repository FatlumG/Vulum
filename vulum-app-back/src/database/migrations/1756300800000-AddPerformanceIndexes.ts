import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPerformanceIndexes1756300800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Products
    await queryRunner.query(`CREATE INDEX idx_products_created_by ON products(created_by)`);
    await queryRunner.query(`CREATE INDEX idx_products_category_id ON products(category_id)`);
    await queryRunner.query(`CREATE INDEX idx_products_status ON products(status)`);

    // Orders
    await queryRunner.query(`CREATE INDEX idx_orders_created_by ON orders(created_by)`);
    await queryRunner.query(`CREATE INDEX idx_orders_status ON orders(status)`);

    // Order Items
    await queryRunner.query(`CREATE INDEX idx_order_items_order_id ON order_items(order_id)`);
    await queryRunner.query(`CREATE INDEX idx_order_items_product_id ON order_items(product_id)`);

    // Invoices
    await queryRunner.query(`CREATE INDEX idx_invoices_user_id ON invoices(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_invoices_order_id ON invoices(order_id)`);

    // Sales
    await queryRunner.query(`CREATE INDEX idx_sales_user_id ON sales(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_sales_order_id ON sales(order_id)`);

    // Favorites — performance index + composite unique to prevent duplicates
    await queryRunner.query(`CREATE INDEX idx_favorites_user_id ON favorites(user_id)`);
    await queryRunner.query(`CREATE INDEX idx_favorites_product_id ON favorites(product_id)`);
    await queryRunner.query(
      `ALTER TABLE favorites ADD CONSTRAINT uk_favorites_user_product UNIQUE (user_id, product_id)`,
    );

    // Product Images
    await queryRunner.query(`CREATE INDEX idx_product_images_product_id ON product_images(product_id)`);

    // Subscriptions
    await queryRunner.query(`CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id)`);

    // Pendings
    await queryRunner.query(`CREATE INDEX idx_pendings_user_id ON pendings(user_id)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Pendings
    await queryRunner.query(`DROP INDEX idx_pendings_user_id ON pendings`);

    // Subscriptions
    await queryRunner.query(`DROP INDEX idx_subscriptions_user_id ON subscriptions`);

    // Product Images
    await queryRunner.query(`DROP INDEX idx_product_images_product_id ON product_images`);

    // Favorites
    await queryRunner.query(`ALTER TABLE favorites DROP CONSTRAINT uk_favorites_user_product`);
    await queryRunner.query(`DROP INDEX idx_favorites_product_id ON favorites`);
    await queryRunner.query(`DROP INDEX idx_favorites_user_id ON favorites`);

    // Sales
    await queryRunner.query(`DROP INDEX idx_sales_order_id ON sales`);
    await queryRunner.query(`DROP INDEX idx_sales_user_id ON sales`);

    // Invoices
    await queryRunner.query(`DROP INDEX idx_invoices_order_id ON invoices`);
    await queryRunner.query(`DROP INDEX idx_invoices_user_id ON invoices`);

    // Order Items
    await queryRunner.query(`DROP INDEX idx_order_items_product_id ON order_items`);
    await queryRunner.query(`DROP INDEX idx_order_items_order_id ON order_items`);

    // Orders
    await queryRunner.query(`DROP INDEX idx_orders_status ON orders`);
    await queryRunner.query(`DROP INDEX idx_orders_created_by ON orders`);

    // Products
    await queryRunner.query(`DROP INDEX idx_products_status ON products`);
    await queryRunner.query(`DROP INDEX idx_products_category_id ON products`);
    await queryRunner.query(`DROP INDEX idx_products_created_by ON products`);
  }
}
