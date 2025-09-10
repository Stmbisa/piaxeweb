"use client";

import { useState, useEffect } from "react";
import { supportAPI, KnowledgeBaseArticle, TicketCategory } from "@/lib/api/support";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Loader2,
  FileText,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS = {
  [TicketCategory.GENERAL]: "General",
  [TicketCategory.PAYMENT_ISSUE]: "Payment Issues",
  [TicketCategory.ACCOUNT_ACCESS]: "Account Access",
  [TicketCategory.TECHNICAL_SUPPORT]: "Technical Support",
  [TicketCategory.BILLING]: "Billing",
  [TicketCategory.MERCHANT_SUPPORT]: "Business Support",
  [TicketCategory.API_SUPPORT]: "Developer Support",
  [TicketCategory.SECURITY_CONCERN]: "Security",
  [TicketCategory.FEATURE_REQUEST]: "Feature Requests",
  [TicketCategory.BUG_REPORT]: "Bug Reports",
};

const CATEGORY_COLORS = {
  [TicketCategory.GENERAL]: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
  [TicketCategory.PAYMENT_ISSUE]: "bg-red-500/10 text-red-600 dark:text-red-400",
  [TicketCategory.ACCOUNT_ACCESS]: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  [TicketCategory.TECHNICAL_SUPPORT]: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  [TicketCategory.BILLING]: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  [TicketCategory.MERCHANT_SUPPORT]: "bg-green-500/10 text-green-600 dark:text-green-400",
  [TicketCategory.API_SUPPORT]: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  [TicketCategory.SECURITY_CONCERN]: "bg-red-600/10 text-red-700 dark:text-red-300",
  [TicketCategory.FEATURE_REQUEST]: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  [TicketCategory.BUG_REPORT]: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

interface KnowledgeBaseProps {
  searchQuery?: string;
}

export function KnowledgeBase({ searchQuery: initialSearchQuery = "" }: KnowledgeBaseProps) {
  const [articles, setArticles] = useState<KnowledgeBaseArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeBaseArticle | null>(null);
  const [showArticle, setShowArticle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);

  const loadArticles = async (page: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      }

      const category = categoryFilter !== "all" ? (categoryFilter as TicketCategory) : undefined;
      const search = searchQuery.trim() || undefined;

      const fetchedArticles = await supportAPI.getKnowledgeBaseArticles(
        category,
        search,
        page,
        20
      );

      if (reset) {
        setArticles(fetchedArticles);
      } else {
        setArticles(prev => [...prev, ...fetchedArticles]);
      }

      setHasMoreArticles(fetchedArticles.length === 20);
      setCurrentPage(page);
    } catch (err) {
      console.error("Failed to load articles:", err);
      setError(err instanceof Error ? err.message : "Failed to load articles");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadArticles(1, true);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleArticleClick = async (article: KnowledgeBaseArticle) => {
    setSelectedArticle(article);
    setShowArticle(true);

    // Track article view (optional - could be done in background)
    try {
      // You could implement article view tracking here
    } catch (err) {
      // Ignore tracking errors
    }
  };

  const handleVote = async (articleId: string, helpful: boolean) => {
    try {
      await supportAPI.voteOnArticle(articleId, helpful);

      // Update the article in the list
      setArticles(prev =>
        prev.map(article =>
          article.id === articleId
            ? {
              ...article,
              helpful_votes: helpful ? article.helpful_votes + 1 : article.helpful_votes,
              not_helpful_votes: !helpful ? article.not_helpful_votes + 1 : article.not_helpful_votes,
            }
            : article
        )
      );

      if (selectedArticle && selectedArticle.id === articleId) {
        setSelectedArticle(prev => prev ? {
          ...prev,
          helpful_votes: helpful ? prev.helpful_votes + 1 : prev.helpful_votes,
          not_helpful_votes: !helpful ? prev.not_helpful_votes + 1 : prev.not_helpful_votes,
        } : null);
      }
    } catch (err) {
      console.error("Failed to vote on article:", err);
    }
  };

  const loadMoreArticles = () => {
    if (!isLoading && hasMoreArticles) {
      loadArticles(currentPage + 1, false);
    }
  };

  useEffect(() => {
    loadArticles(1, true);
  }, [categoryFilter]);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      handleSearch();
    }
  }, [initialSearchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Knowledge Base</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions and learn how to use piaxis effectively
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge base..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                    <SelectItem key={category} value={category}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles */}
      {isLoading && articles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading articles...</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Error Loading Articles</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => loadArticles(1, true)}>Try Again</Button>
          </CardContent>
        </Card>
      ) : articles.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No Articles Found</h3>
            <p className="text-muted-foreground">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your search terms or filters."
                : "No articles are available at the moment."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer transition-all hover:shadow-md"
              onClick={() => handleArticleClick(article)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={CATEGORY_COLORS[article.category]}>
                        {CATEGORY_LABELS[article.category]}
                      </Badge>
                      {article.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                    {article.meta_description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {article.meta_description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {article.view_count} views
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {article.helpful_votes}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3" />
                      {article.not_helpful_votes}
                    </span>
                  </div>
                  {article.author_name && (
                    <span>By {article.author_name}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Load More Button */}
          {hasMoreArticles && (
            <Card>
              <CardContent className="p-4 text-center">
                <Button
                  onClick={loadMoreArticles}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Articles"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Article Detail Dialog */}
      <Dialog open={showArticle} onOpenChange={setShowArticle}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Base Article
            </DialogTitle>
          </DialogHeader>

          {selectedArticle && (
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {/* Article Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={CATEGORY_COLORS[selectedArticle.category]}>
                        {CATEGORY_LABELS[selectedArticle.category]}
                      </Badge>
                      {selectedArticle.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-2xl font-bold mb-2">{selectedArticle.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {selectedArticle.view_count} views
                      </span>
                      {selectedArticle.author_name && (
                        <span>By {selectedArticle.author_name}</span>
                      )}
                      <span>
                        Updated {new Date(selectedArticle.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="prose dark:prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                      className="whitespace-pre-wrap"
                    />
                  </div>

                  {/* Feedback */}
                  <Card className="mt-8">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-3">Was this article helpful?</h3>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(selectedArticle.id, true)}
                          className="flex items-center gap-2"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Yes ({selectedArticle.helpful_votes})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVote(selectedArticle.id, false)}
                          className="flex items-center gap-2"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          No ({selectedArticle.not_helpful_votes})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
