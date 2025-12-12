require 'json'

module Jekyll
  module AssetPathFilter
    def asset_path(input)
      if input
        # Extract just the filename
        filename = File.basename(input)
        
        # Try to read the sprockets manifest to get fingerprinted path
        site = @context.registers[:site]
        manifest_path = File.join(site.dest, 'assets', '.sprockets-manifest-*.json')
        manifest_files = Dir.glob(manifest_path)
        
        if manifest_files.any?
          begin
            manifest = JSON.parse(File.read(manifest_files.first))
            
            # Look for the fingerprinted version in manifest
            if manifest['assets'] && manifest['assets'][filename]
              fingerprinted = manifest['assets'][filename]
              "/assets/#{fingerprinted}"
            else
              # If not in manifest, just use the filename
              "/assets/#{filename}"
            end
          rescue => e
            # If manifest reading fails, fallback
            "/assets/#{filename}"
          end
        else
          # If no manifest exists yet, just prefix with /assets/
          "/assets/#{filename}"
        end
      else
        input
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::AssetPathFilter)
