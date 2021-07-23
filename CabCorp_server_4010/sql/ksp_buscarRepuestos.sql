 
-- exec ksp_buscarRepuestos '';
IF OBJECT_ID('ksp_buscarRepuestos', 'P') IS NOT NULL  
    DROP PROCEDURE ksp_buscarRepuestos;  
GO  
CREATE PROCEDURE ksp_buscarRepuestos ( @codigo varchar(50) ) 
With Encryption
AS
BEGIN
 
    SET NOCOUNT ON;
 
    declare @kodigo     varchar(200);
    declare @deskri     varchar(200);
    declare @descri     varchar(200);
    declare @query      NVARCHAR(2500);
    declare @xkoen      varchar(500);
    declare @xnokoen    varchar(500);
    declare @xmarca     varchar(500);
 
    set @codigo = RTRIM(@codigo);
    set @descri = RTRIM(@codigo);
	 
    set @query   = 'select top 50 EN.codigo,EN.descripcion, EN.parte, EN.precio ';
    set @query  += 'FROM k_articulos AS EN WITH (NOLOCK) ';
 
    -- pasadas por ksp_cambiatodo
    exec ksp_cambiatodo @codigo, @salida = @kodigo OUTPUT ;
    exec ksp_cambiatodo @descri, @salida = @deskri OUTPUT ;
	--
    set @kodigo = case when @kodigo<>'' then '%'+@kodigo+'%' else '' end;
    set @deskri = case when @deskri<>'' then '%'+@deskri+'%' else '' end;
     --
    exec ksp_TipoGoogle 'EN.codigo',   @kodigo, @salida = @xkoen   output;
    exec ksp_TipoGoogle 'EN.descripcion',@deskri, @salida = @xnokoen output;
    --
    set @query = concat( @query, ' WHERE ( ', @xkoen, ' ) OR ( ',  @xnokoen, ' ) ORDER BY EN.codigo ' ); 
    EXECUTE sp_executesql @query;
	--
END;
GO
