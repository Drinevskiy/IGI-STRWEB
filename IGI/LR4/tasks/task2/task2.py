import tasks.task2.analyzer as Analyzer

def task2():
    """
    The task2 function creates a TextAnalyzer object, checks some passwords, prints the text analysis information,
    creates an Archiver object, saves the analysis results to a file and a zip archive, and prints information about the file in the zip archive.
    """
    analyzer = Analyzer.TextAnalyzer()
    print(Analyzer.TextAnalyzer.check_password("BHJ89_fsdjh"))
    print(Analyzer.TextAnalyzer.check_password("yt4B_89fs_djh"))
    print(Analyzer.TextAnalyzer.check_password("89fsdjh"))
    print(Analyzer.TextAnalyzer.check_password("BHJfs_djh"))
    analyzer.print_info()
    archiver = Analyzer.Archiver(analyzer)
    archiver.save_to_file()
    archiver.write_to_zip()
    archiver.print_info_about_zip()