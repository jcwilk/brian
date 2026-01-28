"""
Database migrations for brian
"""

MIGRATIONS = {
    2: [
        # Add link preview fields to knowledge_items
        "ALTER TABLE knowledge_items ADD COLUMN link_title TEXT",
        "ALTER TABLE knowledge_items ADD COLUMN link_description TEXT",
        "ALTER TABLE knowledge_items ADD COLUMN link_image TEXT",
        "ALTER TABLE knowledge_items ADD COLUMN link_site_name TEXT",
    ],
    3: [
        # Add pinboard position fields to knowledge_items
        "ALTER TABLE knowledge_items ADD COLUMN pinboard_x REAL",
        "ALTER TABLE knowledge_items ADD COLUMN pinboard_y REAL",
    ],
    4: [
        # Add knowledge regions for spatial grouping in graph view
        """CREATE TABLE IF NOT EXISTS regions (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            color TEXT DEFAULT '#8b5cf6',
            region_type TEXT NOT NULL DEFAULT 'manual',
            bounds_json TEXT,
            is_visible BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )""",
        """CREATE TABLE IF NOT EXISTS region_items (
            region_id TEXT NOT NULL,
            item_id TEXT NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (region_id, item_id),
            FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE,
            FOREIGN KEY (item_id) REFERENCES knowledge_items(id) ON DELETE CASCADE
        )""",
        "CREATE INDEX IF NOT EXISTS idx_regions_type ON regions(region_type)",
        "CREATE INDEX IF NOT EXISTS idx_regions_visible ON regions(is_visible)",
        "CREATE INDEX IF NOT EXISTS idx_region_items_region ON region_items(region_id)",
        "CREATE INDEX IF NOT EXISTS idx_region_items_item ON region_items(item_id)",
        """CREATE TRIGGER IF NOT EXISTS update_regions_timestamp 
           AFTER UPDATE ON regions
           BEGIN
               UPDATE regions SET updated_at = CURRENT_TIMESTAMP
               WHERE id = NEW.id;
           END""",
    ]
}

def apply_migrations(conn, current_version: int, target_version: int):
    """Apply all migrations between current and target version"""
    cursor = conn.cursor()
    
    for version in range(current_version + 1, target_version + 1):
        if version in MIGRATIONS:
            print(f"Applying migration to version {version}...")
            for sql in MIGRATIONS[version]:
                try:
                    cursor.execute(sql)
                except Exception as e:
                    # Column might already exist, that's ok
                    if "duplicate column" not in str(e).lower():
                        raise
            
            # Update schema version
            cursor.execute(
                "INSERT OR REPLACE INTO schema_version (version) VALUES (?)",
                (version,)
            )
            conn.commit()
            print(f"✓ Migration to version {version} complete")
