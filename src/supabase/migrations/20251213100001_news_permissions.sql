-- Insert sample data for testing news functionality
INSERT INTO news (title, content, excerpt, author, status, tags) VALUES
('Noticia de Prueba', 'Este es el contenido de una noticia de prueba para verificar el funcionamiento del sistema.', 'Resumen de la noticia de prueba', 'Admin', 'draft', ARRAY['prueba', 'test']);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE news TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE news_id_seq TO authenticated;